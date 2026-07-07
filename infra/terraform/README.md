# Terraform - Oficina Mecânica

## Objetivo

Este diretório contém a implementação Terraform utilizada na Fase 2 do Tech Challenge para criar um cluster Kubernetes Kind local e provisionar os recursos da aplicação Oficina Mecânica.

A proposta é demonstrar o uso de Infraestrutura como Código para criar, versionar e reproduzir a infraestrutura necessária à aplicação, complementando os manifests Kubernetes já existentes na pasta `k8s/`.

## Recursos Provisionados

O Terraform provisiona os recursos necessários para executar a aplicação em um cluster Kubernetes local:

- **Namespace:** isola os recursos criados pelo Terraform no namespace `oficina-terraform`, evitando conflito com os manifests da pasta `k8s/`.
- **ConfigMap:** centraliza variáveis não sensíveis utilizadas pela API.
- **Secret:** armazena credenciais e variáveis sensíveis necessárias para a conexão com o banco e configuração da aplicação.
- **PostgreSQL:** cria o Service interno, o StatefulSet e o volume persistente usado pelo banco de dados.
- **API:** cria o Deployment da aplicação NestJS, incluindo init container para execução das migrations Prisma antes da inicialização da API.
- **Service da API:** expõe a aplicação dentro do cluster Kubernetes.
- **HPA:** configura autoscaling horizontal da API com base em CPU e memória.
- **Anotações Prometheus:** marca os pods da API para coleta de métricas em `/metrics`.

## Estrutura da Pasta

```text
infra/
└── terraform/
    ├── cluster/             # criação do cluster Kind local
    ├── versions.tf
    ├── providers.tf
    ├── variables.tf
    ├── main.tf
    ├── outputs.tf
    ├── terraform.tfvars.example
    └── README.md
```

## Recursos Terraform

- `kubernetes_namespace`: namespace Kubernetes gerenciado pelo Terraform.
- `kubernetes_config_map`: variáveis não sensíveis da API.
- `kubernetes_secret`: credenciais e variáveis sensíveis usadas pela aplicação.
- `kubernetes_service.postgres`: Service interno para o PostgreSQL.
- `kubernetes_stateful_set.postgres`: execução do PostgreSQL com armazenamento persistente.
- `volume_claim_template`: PVC usado pelo PostgreSQL.
- `kubernetes_deployment.api`: execução da API NestJS com init container para migrations.
- `kubernetes_service.api`: exposição da API no cluster.
- `kubernetes_horizontal_pod_autoscaler_v2.api`: autoscaling horizontal da API por CPU e memória.
- Anotações `prometheus.io/*` no template do Deployment da API para integração com Prometheus no cluster.

## Pré-requisitos

Antes de executar o Terraform, é necessário ter:

- Terraform instalado localmente.
- Docker ativo, usado pelo Kind para executar os nós do cluster.

Primeiro, crie o cluster local:

```bash
cd infra/terraform/cluster
terraform init
terraform apply
cd ..
```

Essa etapa grava o kubeconfig em `infra/terraform/cluster/kind-kubeconfig`. O provider Kubernetes dos workloads usa, por padrão:

```hcl
kube_config_path    = "./cluster/kind-kubeconfig"
kube_config_context = "kind-oficina-tech-challenge"
```

Se necessário, o contexto pode ser ajustado em `terraform.tfvars`.

## Como Utilizar

Opcionalmente, crie um arquivo local de variáveis a partir do exemplo:

```bash
cp terraform.tfvars.example terraform.tfvars
```

O arquivo `terraform.tfvars.example` contém valores de demonstração. Não use segredos reais em arquivos versionados.

### terraform init

```bash
terraform init
```

### terraform fmt

```bash
terraform fmt -check
```

### terraform validate

```bash
terraform validate
```

### terraform plan

```bash
terraform plan
```

### terraform apply

```bash
terraform apply
```

### terraform destroy

```bash
terraform destroy
```

Use `destroy` apenas em ambiente local ou de demonstração.

## Integração com Kubernetes

O Terraform utiliza o provider Kubernetes para criar recursos diretamente no cluster configurado no `kubeconfig`.

Por padrão, o namespace criado é:

```hcl
namespace_name = "oficina-terraform"
```

Esse namespace foi escolhido para separar os recursos provisionados via Terraform dos recursos definidos nos manifests da pasta `k8s/`.

## Relação com os Manifests da Pasta k8s

A pasta `k8s/` permanece no projeto como referência funcional dos manifests Kubernetes. Ela permite validar a infraestrutura de forma declarativa usando `kubectl kustomize` e mantém explícita a configuração Kubernetes tradicional.

A pasta `infra/terraform/` representa a mesma infraestrutura provisionada por Infraestrutura como Código. Dessa forma, o projeto demonstra duas abordagens complementares:

- `k8s/`: manifests Kubernetes versionados e validados diretamente com `kubectl`.
- `infra/terraform/`: provisionamento dos recursos Kubernetes por meio do Terraform.

Nenhum manifesto da pasta `k8s/` foi removido ou substituído. O Terraform coexiste com esses arquivos e reproduz a infraestrutura necessária para PostgreSQL, API, Service, persistência e autoscaling.

## HPA e Metrics Server

O HPA é criado corretamente e fica associado ao Deployment da API.

Em clusters locais, os targets de CPU e memória podem aparecer como `<unknown>` quando o `metrics-server` não está instalado. Esse comportamento não invalida a implementação: ele apenas indica que o cluster não possui a API de métricas necessária para calcular o uso dinâmico dos pods.

Com o `metrics-server` instalado, o HPA passa a receber métricas reais e pode avaliar as regras de autoscaling configuradas.

## Evidências de Validação

Durante o desenvolvimento da Fase 2 foram executadas as seguintes validações:

```bash
terraform validate
terraform plan
terraform apply
kubectl get pods -n oficina-terraform
kubectl get pvc -n oficina-terraform
kubectl get hpa -n oficina-terraform
```

A API também foi validada via port-forward com:

```bash
curl http://localhost:3000/health
```

Resultado esperado:

```json
{
  "status": "ok",
  "app": "ok",
  "database": "ok"
}
```

## Observações

- Os valores presentes em `terraform.tfvars.example` são apenas exemplos para execução local e demonstração acadêmica.
- Segredos reais não devem ser versionados.
- Arquivos de estado do Terraform, como `.tfstate`, podem conter valores sensíveis e devem ser protegidos.
- Neste projeto, o estado local é utilizado apenas para fins acadêmicos e demonstração da Fase 2.
- Prometheus e Grafana estão implementados no Docker Compose para observabilidade local. No Kubernetes/Terraform, os pods da API já incluem anotações de scrape em `/metrics`; a instalação do Prometheus no cluster permanece como responsabilidade do ambiente.
