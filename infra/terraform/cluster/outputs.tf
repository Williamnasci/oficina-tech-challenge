output "cluster_name" {
  description = "Nome do cluster Kind criado."
  value       = kind_cluster.oficina.name
}

output "kubeconfig_path" {
  description = "Caminho do kubeconfig usado pela etapa de workloads."
  value       = abspath(var.kubeconfig_path)
}

output "kubeconfig_context" {
  description = "Contexto Kubernetes criado pelo Kind."
  value       = "kind-${kind_cluster.oficina.name}"
}
