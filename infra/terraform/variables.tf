variable "kube_config_path" {
  description = "Caminho do arquivo kubeconfig local usado pelo provider Kubernetes."
  type        = string
  default     = "~/.kube/config"
}

variable "kube_config_context" {
  description = "Contexto opcional do kubeconfig. Deixe null para usar o contexto atual."
  type        = string
  default     = null
}

variable "namespace_name" {
  description = "Namespace Kubernetes gerenciado pelo Terraform."
  type        = string
  default     = "oficina-terraform"
}

variable "app_name" {
  description = "Nome da aplicação usado nas labels."
  type        = string
  default     = "oficina-api"
}

variable "config_map_name" {
  description = "Nome do ConfigMap da API."
  type        = string
  default     = "oficina-api-config"
}

variable "secret_name" {
  description = "Nome do Secret da aplicação."
  type        = string
  default     = "oficina-secrets"
}

variable "app_port" {
  description = "Porta HTTP usada pela aplicação NestJS."
  type        = number
  default     = 3000
}

variable "jwt_expires_in" {
  description = "Tempo de expiração do JWT."
  type        = string
  default     = "1d"
}

variable "cors_origin" {
  description = "Origem CORS permitida para a API."
  type        = string
  default     = "*"
}

variable "postgres_user" {
  description = "Usuário PostgreSQL para o ambiente de demonstração."
  type        = string
  default     = "postgres"
}

variable "postgres_password" {
  description = "Senha PostgreSQL para o ambiente de demonstração."
  type        = string
  default     = "supersecretpassword"
  sensitive   = true
}

variable "postgres_db" {
  description = "Nome do banco de dados PostgreSQL."
  type        = string
  default     = "oficina_db"
}

variable "jwt_secret" {
  description = "Secret JWT para o ambiente de demonstração."
  type        = string
  default     = "supersecretkey"
  sensitive   = true
}
