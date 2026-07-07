variable "cluster_name" {
  description = "Nome do cluster Kubernetes local criado pelo Kind."
  type        = string
  default     = "oficina-tech-challenge"
}

variable "kubeconfig_path" {
  description = "Arquivo kubeconfig gerado para o cluster local."
  type        = string
  default     = "./kind-kubeconfig"
}
