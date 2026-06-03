locals {
  common_labels = {
    app          = var.app_name
    "managed-by" = "terraform"
    project      = "oficina-tech-challenge"
  }

  database_url = "postgresql://${var.postgres_user}:${var.postgres_password}@postgres:5432/${var.postgres_db}?schema=public"
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
    PORT           = tostring(var.app_port)
    JWT_EXPIRES_IN = var.jwt_expires_in
    CORS_ORIGIN    = var.cors_origin
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
    POSTGRES_USER     = var.postgres_user
    POSTGRES_PASSWORD = var.postgres_password
    POSTGRES_DB       = var.postgres_db
    JWT_SECRET        = var.jwt_secret
    DATABASE_URL      = local.database_url
  }
}
