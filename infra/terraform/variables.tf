variable "kube_config_path" {
  description = "Caminho do arquivo kubeconfig local usado pelo provider Kubernetes."
  type        = string
  default     = "./cluster/kind-kubeconfig"
}

variable "kube_config_context" {
  description = "Contexto opcional do kubeconfig. Deixe null para usar o contexto atual."
  type        = string
  default     = "kind-oficina-tech-challenge"
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

variable "api_deployment_name" {
  description = "Nome do Deployment Kubernetes da API."
  type        = string
  default     = "oficina-api"
}

variable "api_service_name" {
  description = "Nome do Service Kubernetes da API."
  type        = string
  default     = "oficina-api"
}

variable "api_image" {
  description = "Imagem Docker usada pela API."
  type        = string
  default     = "williamnasci/oficina-tech-challenge:latest"
}

variable "api_image_pull_policy" {
  description = "Política de pull da imagem da API."
  type        = string
  default     = "IfNotPresent"
}

variable "api_replicas" {
  description = "Quantidade inicial de réplicas da API."
  type        = number
  default     = 2
}

variable "api_service_type" {
  description = "Tipo do Service Kubernetes da API."
  type        = string
  default     = "LoadBalancer"
}

variable "api_service_port" {
  description = "Porta exposta pelo Service Kubernetes da API."
  type        = number
  default     = 80
}

variable "api_cpu_request" {
  description = "CPU request da API."
  type        = string
  default     = "100m"
}

variable "api_memory_request" {
  description = "Memory request da API."
  type        = string
  default     = "256Mi"
}

variable "api_cpu_limit" {
  description = "CPU limit da API."
  type        = string
  default     = "500m"
}

variable "api_memory_limit" {
  description = "Memory limit da API."
  type        = string
  default     = "512Mi"
}

variable "hpa_name" {
  description = "Nome do Horizontal Pod Autoscaler da API."
  type        = string
  default     = "oficina-api-hpa"
}

variable "hpa_min_replicas" {
  description = "Quantidade mínima de réplicas gerenciada pelo HPA."
  type        = number
  default     = 2
}

variable "hpa_max_replicas" {
  description = "Quantidade máxima de réplicas gerenciada pelo HPA."
  type        = number
  default     = 6
}

variable "hpa_cpu_target" {
  description = "Percentual médio de utilização de CPU alvo para o HPA."
  type        = number
  default     = 70
}

variable "hpa_memory_target" {
  description = "Percentual médio de utilização de memória alvo para o HPA."
  type        = number
  default     = 75
}

variable "postgres_service_name" {
  description = "Nome do Service Kubernetes do PostgreSQL."
  type        = string
  default     = "postgres"
}

variable "postgres_statefulset_name" {
  description = "Nome do StatefulSet Kubernetes do PostgreSQL."
  type        = string
  default     = "postgres"
}

variable "postgres_volume_claim_name" {
  description = "Nome do template de PersistentVolumeClaim usado pelo PostgreSQL."
  type        = string
  default     = "postgres-data"
}

variable "postgres_image" {
  description = "Imagem Docker usada pelo container PostgreSQL."
  type        = string
  default     = "postgres:15"
}

variable "postgres_storage_size" {
  description = "Tamanho do volume persistente solicitado para o PostgreSQL."
  type        = string
  default     = "1Gi"
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

variable "auth_demo_username" {
  description = "Usuário demonstrativo usado no login acadêmico da API."
  type        = string
  default     = "admin"
}

variable "auth_demo_password" {
  description = "Senha demonstrativa usada no login acadêmico da API."
  type        = string
  default     = "admin"
  sensitive   = true
}

variable "status_notification_webhook_url" {
  description = "Webhook opcional que recebe as mudanças de status das ordens de serviço."
  type        = string
  default     = ""
  sensitive   = true
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

variable "postgres_database" {
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
