# Histórico da Fase 2

## Objetivo

Evoluir o backend da Oficina Mecânica para atender aos requisitos de qualidade, resiliência, escalabilidade, automação e infraestrutura da Fase 2 do Tech Challenge, preservando a arquitetura modular já existente no projeto.

Esta documentação registra o histórico da implementação da Fase 2 e consolida as entregas realizadas.

## Status Geral

A Fase 2 foi concluída com os seguintes pilares:

- Docker e Docker Compose para execução local.
- PostgreSQL containerizado.
- Health check da API validando aplicação e banco de dados.
- Kubernetes com API, PostgreSQL, ConfigMap, Secret, Service, StatefulSet, PVC e HPA.
- Terraform em `infra/terraform` provisionando recursos equivalentes em um cluster Kubernetes local.
- GitHub Actions com build, testes, Docker build/push, Trivy e validação dos manifests Kubernetes.
- Dashboard Grafana validado com métricas reais da API.
- Prometheus coletando métricas através do endpoint /metrics.

## Entregas Concluídas

### Aplicação

- Backend NestJS mantido como monolito modular.
- Prisma configurado com PostgreSQL.
- Migrations estabilizadas e alinhadas ao `schema.prisma`.
- Endpoint `/health` retornando status da aplicação e do banco.
- Testes automatizados executados no pipeline.

### Docker

- `Dockerfile` multi-stage com Node.js 22 Alpine.
- `docker-compose.yml` com API e PostgreSQL.
- PostgreSQL com volume persistente.
- Healthchecks configurados para API e banco.
- Prometheus e Grafana configurados para observabilidade local.

### Kubernetes

- Manifests em `k8s/`.
- Namespace `oficina`.
- ConfigMap e Secret.
- PostgreSQL via StatefulSet e Service.
- Volume persistente via `volumeClaimTemplates`.
- API via Deployment e Service.
- Readiness e liveness probes usando `/health`.
- HPA por CPU e memória.

### Terraform

- Estrutura criada em `infra/terraform`.
- Kubernetes Provider configurado.
- Namespace, ConfigMap e Secret.
- PostgreSQL Service, StatefulSet e PVC.
- API Deployment e Service.
- HPA via `kubernetes_horizontal_pod_autoscaler_v2`.
- Outputs relevantes para os recursos provisionados.

### CI/CD

- Workflow em `.github/workflows/ci-cd.yml`.
- Job de qualidade com PostgreSQL, Prisma Client, migrations, build e testes.
- Docker build e push para Docker Hub somente na branch `main` e fora de Pull Requests.
- Trivy para scan da imagem Docker e do filesystem.
- Validação Kubernetes com `kubectl kustomize k8s`.
- Métricas Prometheus em `/metrics` e dashboard Grafana inicial.

## Evidências de Validação

Durante a consolidação da Fase 2, foram utilizados os seguintes comandos e verificações:

- `npm run build`.
- `npm test -- --runInBand`.
- `docker build`.
- `docker compose`.
- `kubectl kustomize k8s`.
- `terraform validate`.
- `terraform plan`.
- `terraform apply`.
- `kubectl get pods`.
- `kubectl get pvc`.
- `kubectl get hpa`.
- `/health` com HTTP 200 e `database: ok`.
- `/metrics` expondo métricas Prometheus da API.

Essas validações demonstram que a aplicação, a infraestrutura containerizada, os manifests Kubernetes, a infraestrutura Terraform e a pipeline de CI/CD foram exercitados de forma integrada.

## Observações

- Os manifests Kubernetes e os arquivos de exemplo do Terraform utilizam valores ilustrativos para fins acadêmicos e de demonstração. Em ambientes reais, recomenda-se o uso de mecanismos seguros de gerenciamento de segredos, evitando o versionamento de credenciais sensíveis.
- O HPA foi provisionado, validado e associado ao Deployment da API. Em clusters locais sem `metrics-server`, os targets de CPU e memória podem aparecer como `<unknown>`. Isso não invalida a criação do recurso nem sua associação ao Deployment; apenas indica ausência da API de métricas no cluster.
- Prometheus e Grafana foram implementados como observabilidade mínima viável. OpenTelemetry, Loki e Jaeger permanecem como evolução opcional para uma etapa futura.

## Conclusão

A Fase 2 está concluída no escopo de Docker, Docker Compose, Kubernetes, Terraform, CI/CD, segurança automatizada com Trivy, observabilidade mínima com Prometheus/Grafana e validação da aplicação em ambiente containerizado.
