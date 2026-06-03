output "namespace_name" {
  description = "Namespace Kubernetes gerenciado pelo Terraform."
  value       = kubernetes_namespace.oficina.metadata[0].name
}

output "config_map_name" {
  description = "ConfigMap criado para configurações não sensíveis da API."
  value       = kubernetes_config_map.api_config.metadata[0].name
}

output "secret_name" {
  description = "Secret criado para configurações sensíveis da aplicação."
  value       = kubernetes_secret.app_secrets.metadata[0].name
}

output "postgres_service_name" {
  description = "Service Kubernetes criado para o PostgreSQL."
  value       = kubernetes_service.postgres.metadata[0].name
}

output "postgres_statefulset_name" {
  description = "StatefulSet Kubernetes criado para o PostgreSQL."
  value       = kubernetes_stateful_set.postgres.metadata[0].name
}

output "postgres_pvc_name" {
  description = "Nome esperado do PersistentVolumeClaim criado pelo StatefulSet."
  value       = local.postgres_pvc_name
}
