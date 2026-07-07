locals {
  common_labels = {
    app          = var.app_name
    "managed-by" = "terraform"
    project      = "oficina-tech-challenge"
  }

  postgres_labels = {
    app          = var.postgres_statefulset_name
    "managed-by" = "terraform"
    project      = "oficina-tech-challenge"
  }

  database_url      = "postgresql://${var.postgres_user}:${var.postgres_password}@${var.postgres_service_name}:5432/${var.postgres_database}?schema=public"
  postgres_pvc_name = "${var.postgres_volume_claim_name}-${var.postgres_statefulset_name}-0"
}

resource "kubernetes_namespace" "oficina" {
  metadata {
    name   = var.namespace_name
    labels = local.common_labels
  }
}

resource "kubernetes_config_map" "api_config" {
  metadata {
    name      = var.config_map_name
    namespace = kubernetes_namespace.oficina.metadata[0].name
    labels    = local.common_labels
  }

  data = {
    PORT               = tostring(var.app_port)
    JWT_EXPIRES_IN     = var.jwt_expires_in
    CORS_ORIGIN        = var.cors_origin
    AUTH_DEMO_USERNAME = var.auth_demo_username
  }
}

resource "kubernetes_secret" "app_secrets" {
  metadata {
    name      = var.secret_name
    namespace = kubernetes_namespace.oficina.metadata[0].name
    labels    = local.common_labels
  }

  type = "Opaque"

  data = {
    POSTGRES_USER                   = var.postgres_user
    POSTGRES_PASSWORD               = var.postgres_password
    POSTGRES_DB                     = var.postgres_database
    JWT_SECRET                      = var.jwt_secret
    AUTH_DEMO_PASSWORD              = var.auth_demo_password
    DATABASE_URL                    = local.database_url
    STATUS_NOTIFICATION_WEBHOOK_URL = var.status_notification_webhook_url
  }
}

resource "kubernetes_service" "postgres" {
  metadata {
    name      = var.postgres_service_name
    namespace = kubernetes_namespace.oficina.metadata[0].name
    labels    = local.postgres_labels
  }

  spec {
    selector = {
      app = var.postgres_statefulset_name
    }

    port {
      name        = "postgres"
      port        = 5432
      target_port = 5432
    }
  }
}

resource "kubernetes_stateful_set" "postgres" {
  metadata {
    name      = var.postgres_statefulset_name
    namespace = kubernetes_namespace.oficina.metadata[0].name
    labels    = local.postgres_labels
  }

  spec {
    service_name = kubernetes_service.postgres.metadata[0].name
    replicas     = 1

    selector {
      match_labels = {
        app = var.postgres_statefulset_name
      }
    }

    template {
      metadata {
        labels = {
          app = var.postgres_statefulset_name
        }
      }

      spec {
        container {
          name              = "postgres"
          image             = var.postgres_image
          image_pull_policy = "IfNotPresent"

          port {
            container_port = 5432
            name           = "postgres"
          }

          env {
            name = "POSTGRES_USER"

            value_from {
              secret_key_ref {
                name = kubernetes_secret.app_secrets.metadata[0].name
                key  = "POSTGRES_USER"
              }
            }
          }

          env {
            name = "POSTGRES_PASSWORD"

            value_from {
              secret_key_ref {
                name = kubernetes_secret.app_secrets.metadata[0].name
                key  = "POSTGRES_PASSWORD"
              }
            }
          }

          env {
            name = "POSTGRES_DB"

            value_from {
              secret_key_ref {
                name = kubernetes_secret.app_secrets.metadata[0].name
                key  = "POSTGRES_DB"
              }
            }
          }

          readiness_probe {
            exec {
              command = ["pg_isready", "-U", var.postgres_user]
            }

            initial_delay_seconds = 10
            period_seconds        = 10
          }

          liveness_probe {
            exec {
              command = ["pg_isready", "-U", var.postgres_user]
            }

            initial_delay_seconds = 30
            period_seconds        = 20
          }

          volume_mount {
            name       = var.postgres_volume_claim_name
            mount_path = "/var/lib/postgresql/data"
          }

          resources {
            requests = {
              cpu    = "100m"
              memory = "256Mi"
            }

            limits = {
              cpu    = "500m"
              memory = "512Mi"
            }
          }
        }
      }
    }

    volume_claim_template {
      metadata {
        name = var.postgres_volume_claim_name
      }

      spec {
        access_modes = ["ReadWriteOnce"]

        resources {
          requests = {
            storage = var.postgres_storage_size
          }
        }
      }
    }
  }
}

resource "kubernetes_deployment" "api" {
  metadata {
    name      = var.api_deployment_name
    namespace = kubernetes_namespace.oficina.metadata[0].name
    labels    = local.common_labels
  }

  spec {
    replicas = var.api_replicas

    selector {
      match_labels = {
        app = var.app_name
      }
    }

    template {
      metadata {
        labels = {
          app = var.app_name
        }

        annotations = {
          "prometheus.io/scrape" = "true"
          "prometheus.io/path"   = "/metrics"
          "prometheus.io/port"   = tostring(var.app_port)
        }
      }

      spec {
        init_container {
          name              = "prisma-migrate"
          image             = var.api_image
          image_pull_policy = var.api_image_pull_policy
          command           = ["sh", "-c", "npx prisma migrate deploy"]

          security_context {
            run_as_non_root            = true
            run_as_user                = 1000
            allow_privilege_escalation = false
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.api_config.metadata[0].name
            }
          }

          env_from {
            secret_ref {
              name = kubernetes_secret.app_secrets.metadata[0].name
            }
          }
        }

        container {
          name              = var.app_name
          image             = var.api_image
          image_pull_policy = var.api_image_pull_policy

          security_context {
            run_as_non_root            = true
            run_as_user                = 1000
            allow_privilege_escalation = false
          }

          port {
            container_port = var.app_port
            name           = "http"
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.api_config.metadata[0].name
            }
          }

          env_from {
            secret_ref {
              name = kubernetes_secret.app_secrets.metadata[0].name
            }
          }

          readiness_probe {
            http_get {
              path = "/health"
              port = "http"
            }

            initial_delay_seconds = 10
            period_seconds        = 10
          }

          liveness_probe {
            http_get {
              path = "/health"
              port = "http"
            }

            initial_delay_seconds = 30
            period_seconds        = 20
          }

          resources {
            requests = {
              cpu    = var.api_cpu_request
              memory = var.api_memory_request
            }

            limits = {
              cpu    = var.api_cpu_limit
              memory = var.api_memory_limit
            }
          }
        }
      }
    }
  }

  depends_on = [
    kubernetes_service.postgres,
    kubernetes_stateful_set.postgres,
  ]
}

resource "kubernetes_service" "api" {
  wait_for_load_balancer = false

  metadata {
    name      = var.api_service_name
    namespace = kubernetes_namespace.oficina.metadata[0].name
    labels    = local.common_labels
  }

  spec {
    type = var.api_service_type

    selector = {
      app = var.app_name
    }

    port {
      name        = "http"
      port        = var.api_service_port
      target_port = "http"
    }
  }
}

resource "kubernetes_horizontal_pod_autoscaler_v2" "api" {
  metadata {
    name      = var.hpa_name
    namespace = kubernetes_namespace.oficina.metadata[0].name
    labels    = local.common_labels
  }

  spec {
    min_replicas = var.hpa_min_replicas
    max_replicas = var.hpa_max_replicas

    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = kubernetes_deployment.api.metadata[0].name
    }

    metric {
      type = "Resource"

      resource {
        name = "cpu"

        target {
          type                = "Utilization"
          average_utilization = var.hpa_cpu_target
        }
      }
    }

    metric {
      type = "Resource"

      resource {
        name = "memory"

        target {
          type                = "Utilization"
          average_utilization = var.hpa_memory_target
        }
      }
    }
  }
}
