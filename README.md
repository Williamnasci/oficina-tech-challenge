# Oficina Tech Challenge

## Descrição do Projeto

Sistema back-end para gestão de oficinas mecânicas, desenvolvido como entrega do **Tech Challenge Fase 2** da Pós-Tech FIAP em Arquitetura de Software.

A aplicação centraliza o fluxo operacional de uma oficina, contemplando cadastro de clientes, veículos, ordens de serviço, catálogo de serviços, controle de estoque de peças e insumos, orçamento e acompanhamento do ciclo de vida da ordem de serviço.

## Objetivo

O sistema foi projetado para apoiar os principais processos de uma oficina mecânica:

- Cadastro e gestão de clientes com CPF/CNPJ.
- Cadastro e gestão de veículos.
- Criação e acompanhamento de ordens de serviço.
- Registro de diagnóstico técnico.
- Inclusão de serviços e peças em ordens de serviço.
- Controle de estoque com baixa automática.
- Cálculo de orçamento.
- Fluxo de aprovação e evolução de status.
- Notificação externa das mudanças de status por webhook configurável.
- Métricas operacionais de tempo médio de execução.

## Tecnologias Utilizadas

| Tecnologia | Função |
|------------|--------|
| Node.js 22 + TypeScript | Runtime e tipagem estática |
| NestJS | Framework principal da API |
| Prisma ORM | Persistência type-safe |
| PostgreSQL | Banco de dados relacional |
| Swagger | Documentação da API |
| Jest + Supertest | Testes automatizados |
| Docker | Containerização da aplicação |
| Docker Compose | Orquestração local da API e do banco |
| Kubernetes | Orquestração local dos serviços |
| Terraform | Infraestrutura como Código |
| GitHub Actions | Pipeline de CI/CD |
| Trivy | Análise de vulnerabilidades |
| Prometheus | Coleta de métricas da API |
| Grafana | Dashboard inicial de observabilidade |

## Arquitetura do Sistema

O projeto segue uma organização modular inspirada em DDD, Clean Architecture e arquitetura em camadas:

- **Domain:** entidades, value objects, enums, regras de negócio e contratos de repositório.
- **Application:** casos de uso, DTOs e mappers.
- **Infrastructure:** implementações Prisma dos repositórios e integrações técnicas.
- **Interfaces/HTTP:** controllers REST, Swagger, guards e DTOs de entrada.
- **Shared:** infraestrutura compartilhada, PrismaService e filtros globais.

As regras centrais ficam no domínio e nos casos de uso. Detalhes como HTTP, Swagger, Prisma, Docker, Kubernetes e Terraform ficam nas camadas externas ou na infraestrutura do projeto.

## Funcionalidades

### Customers

- Cadastro com validação de CPF/CNPJ.
- Consulta por ID ou documento.
- Listagem, atualização e exclusão lógica.

### Vehicles

- Cadastro com validação de placa.
- Vínculo com cliente.
- Listagem, atualização e exclusão lógica.

### Service Orders

- Criação vinculada a cliente e veículo ativos.
- Abertura completa com cliente, veículo, serviços e peças.
- Registro de diagnóstico.
- Adição de serviços e itens de estoque.
- Cálculo automático de orçamento.
- Aprovação ou recusa de orçamento.
- Consulta de status.
- Listagem operacional.
- Métrica de tempo médio de execução.

Fluxo de status:

```text
RECEIVED -> IN_DIAGNOSIS -> WAITING_APPROVAL -> APPROVED -> IN_PROGRESS -> FINISHED -> DELIVERED
```

### Stock Items

- Cadastro de peças e insumos.
- SKU único.
- Baixa automática de estoque.
- Listagem, atualização e exclusão lógica.

### Service Catalog

- Cadastro de serviços.
- Preço e descrição.
- Listagem, atualização e exclusão lógica.

## Documentação dos Endpoints da API (Fase 2)

As rotas da API estão descritas de forma interativa no Swagger e implementam os requisitos obrigatórios da Fase 2:

### 1. Abertura Completa de Ordem de Serviço (OS)
- **Método/Rota**: `POST /service-orders/opening`
- **Autenticação**: Requer Bearer Token (JWT)
- **Descrição**: Abre uma nova OS vinculando cliente, veículo, serviços e peças. Retorna o ID único gerado para a OS.
- **Payload de Exemplo**:
  ```json
  {
    "customer": {
      "name": "John Doe",
      "documentType": "CPF",
      "document": "52998224725",
      "phone": "11999999999",
      "email": "john@example.com"
    },
    "vehicle": {
      "licensePlate": "ABC1D23",
      "brand": "Toyota",
      "model": "Corolla",
      "year": 2022
    },
    "services": [
      {
        "serviceId": "88ef38db-e956-4e26-807e-e709b87c25af",
        "quantity": 1
      }
    ],
    "stockItems": [
      {
        "stockItemId": "90a44f7f-6798-44f8-8c23-d6d20dcd4ed0",
        "quantity": 2
      }
    ]
  }
  ```
- **Resposta**: `201 Created` com `{ "id": "uuid-da-os" }`

### 2. Consulta de Status da OS
- **Método/Rota**: `GET /service-orders/:id/status`
- **Descrição**: Informa a situação atual da OS especificada pelo ID.
- **Resposta**: `200 OK`
  ```json
  {
    "status": "RECEIVED"
  }
  ```
  *(Status possíveis: RECEIVED, IN_DIAGNOSIS, WAITING_APPROVAL, APPROVED, IN_PROGRESS, FINISHED, DELIVERED)*

### 3. Decisão Externa de Orçamento (Aprovação/Recusa)
- **Método/Rota**: `POST /service-orders/:id/budget-decision`
- **Descrição**: Endpoint para receber notificações externas de aprovação ou recusa do orçamento do cliente.
- **Payload de Exemplo**:
  ```json
  {
    "decision": "APPROVED"
  }
  ```
- **Resposta**: `204 No Content`

### 4. Listagem Operacional de Ordens de Serviço (Fila de Trabalho)
- **Método/Rota**: `GET /service-orders/operational-queue`
- **Autenticação**: Requer Bearer Token (JWT)
- **Descrição**: Retorna a listagem de ordens de serviço ativas na oficina com ordenação estrita por prioridade de status (`IN_PROGRESS` > `APPROVED` > `WAITING_APPROVAL` > `IN_DIAGNOSIS` > `RECEIVED`) e as mais antigas primeiro. Exclui logicamente ordens finalizadas (`FINISHED`) e entregues (`DELIVERED`).
- **Resposta**: `200 OK` com a lista ordenada de OS.

### Documentação Swagger

A especificação OpenAPI / Swagger pode ser acessada localmente após iniciar a aplicação:
- **Swagger URL**: `http://localhost:3000/docs`

> [!NOTE]
> Para testar os endpoints protegidos por autenticação no Swagger, acesse a rota `POST /auth/login` com o usuário de demonstração acadêmica (`admin` / `admin`), copie o token JWT gerado e insira-o clicando no botão **Authorize** (formato: `Bearer <token>`).

---

## Vídeo de Demonstração

[Adicionar link do vídeo demonstrativo]

---

## Infraestrutura Implementada

### Docker

- `Dockerfile` multi-stage com Node.js 22 Alpine.
- Geração do Prisma Client durante o build.
- Runtime com usuário não root.
- API exposta na porta `3000`.

### Docker Compose

- API NestJS.
- PostgreSQL 15 em container.
- Volume persistente para o banco.
- Healthcheck do PostgreSQL.
- Healthcheck da API em `/health`.
- Execução das migrations Prisma antes da inicialização da API.
- Prometheus coletando métricas em `/metrics`.
- Grafana provisionado com datasource Prometheus e dashboard inicial.

Para acesso ao PostgreSQL pelo host local, o Compose expõe o banco em `localhost:15432`.
Essa é a porta oficial do PostgreSQL para execução local fora dos containers.

### Observabilidade Local

O Docker Compose inclui uma solução mínima viável de observabilidade:

- API NestJS expondo métricas Prometheus em `/metrics`.
- Prometheus em `http://localhost:9090`.
- Grafana em `http://localhost:3001` com login `admin` / `admin`.
- Dashboard inicial `Oficina API` com requisições, latência e health checks.

Arquivos principais:

- `monitoring/prometheus/prometheus.yml`.
- `monitoring/grafana/provisioning/datasources/prometheus.yml`.
- `monitoring/grafana/provisioning/dashboards/oficina.yml`.
- `monitoring/grafana/dashboards/oficina-api.json`.

### Kubernetes

Os manifests ficam em `k8s/` e incluem:

- Namespace.
- ConfigMap.
- Secret.
- PostgreSQL Service.
- PostgreSQL StatefulSet.
- PVC via `volumeClaimTemplates`.
- API Deployment.
- API Service.
- Readiness probe em `/health`.
- Liveness probe em `/health`.
- HPA por CPU e memória.

Validação dos manifests:

```bash
kubectl kustomize k8s
```

### Terraform

A implementação Terraform fica em `infra/terraform/` e está dividida em duas etapas:

- `infra/terraform/cluster`: cria um cluster Kubernetes Kind local com um control plane e dois workers.
- `infra/terraform`: provisiona os workloads da aplicação no cluster criado.

O provisionamento dos workloads inclui:

- Namespace `oficina-terraform`.
- ConfigMap.
- Secret.
- PostgreSQL Service.
- PostgreSQL StatefulSet.
- PersistentVolumeClaim.
- API Deployment.
- API Service.
- HPA via `kubernetes_horizontal_pod_autoscaler_v2`.

Comandos principais para criar o cluster:

```bash
cd infra/terraform/cluster
terraform init
terraform apply
cd ..
```

Depois, para provisionar a aplicação e o banco:

```bash
cd infra/terraform
terraform init
terraform fmt -check
terraform validate
terraform plan
terraform apply
```

## Evidências de Validação

Durante a consolidação da Fase 2, foram utilizados os seguintes comandos de validação:

```bash
npm run build
npm test -- --runInBand
docker build -t williamnasci/oficina-tech-challenge:test .
docker compose config
docker compose up --build
kubectl kustomize k8s
terraform validate
terraform plan
terraform apply
kubectl get pods -n oficina-terraform
kubectl get pvc -n oficina-terraform
kubectl get hpa -n oficina-terraform
```

A API também foi validada por port-forward:

```bash
kubectl port-forward svc/oficina-api 3000:80 -n oficina-terraform
```

Health check:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/metrics
```

Payload esperado:

```json
{
  "status": "ok",
  "app": "ok",
  "database": "ok",
  "timestamp": "..."
}
```

## HPA e Metrics Server

O HPA está criado e associado ao Deployment da API. Para demonstrar escalabilidade no cluster Kind, instale o Metrics Server e habilite a comunicação com os kubelets locais:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.8.1/components.yaml
kubectl patch deployment metrics-server -n kube-system --type=json -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
kubectl rollout status deployment/metrics-server -n kube-system
kubectl top pods -n oficina
```

O argumento `--kubelet-insecure-tls` é destinado somente ao cluster local de demonstração.

Para gerar carga durante a gravação do vídeo:

```bash
kubectl apply -f k8s/demo/load-generator.yaml
kubectl get hpa,pods -n oficina -w
kubectl delete -f k8s/demo/load-generator.yaml
```

Em clusters locais sem `metrics-server`, os targets de CPU e memória podem aparecer como `<unknown>`. Isso não invalida o provisionamento do HPA; apenas indica que o cluster não está expondo a API de métricas necessária para o cálculo dinâmico.

## Notificação Externa de Status

As mudanças de status da ordem de serviço são publicadas por uma porta de aplicação, implementada por um adaptador HTTP. Configure `STATUS_NOTIFICATION_WEBHOOK_URL` com um receptor HTTP, como o webhook.site durante a demonstração. O adaptador envia `serviceOrderId`, `status` e `occurredAt` em JSON.

Se a variável não estiver configurada, a notificação é ignorada. Se o serviço externo estiver indisponível, a alteração de status já persistida não é revertida.

## CI/CD - GitHub Actions

O workflow fica em `.github/workflows/ci-cd.yml`.

Eventos:

- `push` na branch `main`.
- `pull_request` para `main`.
- execução manual por `workflow_dispatch`.

Jobs:

| Job | Objetivo |
|-----|----------|
| `quality` | Instala dependências, gera o Prisma Client, aplica migrations, executa build e testes |
| `docker` | Gera a imagem Docker e publica no Docker Hub apenas na `main` e fora de Pull Requests |
| `security` | Executa scan Trivy da imagem e do filesystem |
| `kubernetes-validate` | Renderiza os manifests com `kubectl kustomize k8s` |
| `deploy` | Executa deploy no Kubernetes na branch `main`, usando runner hospedado para cluster remoto ou runner self-hosted para cluster local |

Secrets necessários no GitHub:

```text
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
KUBE_CONFIG (necessário apenas para cluster remoto)
```

Variável opcional do repositório:

```text
DEPLOY_RUNNER=self-hosted
```

- `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN` são usados para publicar imagem no Docker Hub;
- `KUBE_CONFIG` configura o acesso a um cluster remoto;
- para o cluster Kind local, configure a variável de repositório `DEPLOY_RUNNER=self-hosted`, mantenha um runner local ativo e grave o conteúdo de `infra/terraform/cluster/kind-kubeconfig` no secret `KUBE_CONFIG`;
- o deploy falha quando nenhum cluster acessível está configurado, evitando um falso sucesso da entrega contínua.


## SonarQube

O repositório mantém `sonar-project.properties` com fontes, testes, exclusões e leitura de cobertura Jest em `coverage/lcov.info`.

O serviço `sonarqube` no `docker-compose.yml` permite análise local/manual em `http://localhost:9000`. No pipeline atual, a análise efetivamente automatizada de segurança é feita pelo Trivy, enquanto cobertura e qualidade funcional são validadas por Jest, build TypeScript e testes automatizados.

## Segurança

- JWT obrigatório via `JWT_SECRET`.
- Helmet aplicado globalmente.
- CORS configurável por variável de ambiente.
- Docker executando como usuário não root.
- Validação de entrada com `ValidationPipe`.
- Trivy executado no pipeline.
- Relatório complementar em `docs/security-report.md`.

## Como Executar Localmente

Configure o arquivo `.env`:

```env
DATABASE_URL="postgresql://postgres:supersecretpassword@localhost:15432/oficina_db?schema=public"
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=1d
AUTH_DEMO_USERNAME=admin
AUTH_DEMO_PASSWORD=admin
STATUS_NOTIFICATION_WEBHOOK_URL=
CORS_ORIGIN=http://localhost:3000
PORT=3000
```

### Fluxo Docker Completo

Use este fluxo quando quiser subir API, banco, SonarQube, Prometheus e Grafana em containers:

```bash
docker compose up -d --build
```

Serviços principais:

- API: `http://localhost:3000`
- Health check: `http://localhost:3000/health`
- Métricas Prometheus: `http://localhost:3000/metrics`
- Swagger: `http://localhost:3000/docs`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001`
- SonarQube: `http://localhost:9000`

### Fluxo Desenvolvimento Local

Use este fluxo quando quiser rodar a API pelo NestJS local e apenas o banco em container:

```bash
npm install
docker compose up -d db
npm run start:dev
```

Neste modo, evite subir o serviço `api` do Compose ao mesmo tempo para não disputar a porta `3000`.

Acesse:

- API: `http://localhost:3000`
- Health check: `http://localhost:3000/health`
- Métricas Prometheus: `http://localhost:3000/metrics`
- Swagger: `http://localhost:3000/docs`

## Autenticação

Rota pública:

```http
POST /auth/login
```

Payload de demonstração:

```json
{
  "username": "admin",
  "password": "admin"
}
```

Use o token retornado como Bearer Token no Swagger.

## Testes

O projeto possui testes automatizados unitários e de integração para os fluxos principais da aplicação.

Validação local recente com `npm test -- --runInBand`:

- 63 suítes de teste.
- 216 testes automatizados.

Comandos:

```bash
npm test
npm run test:cov
```

## Documentação Complementar

| Documento | Local |
|-----------|-------|
| Arquitetura | `docs/architecture.md` |
| Bounded Contexts | `docs/bounded-contexts.md` |
| Domain Storytelling | `docs/domain-storytelling.md` |
| Event Storming | `docs/event-storming.md` |
| Linguagem Ubíqua | `docs/ubiquitous-language.md` |
| Kubernetes | `docs/kubernetes.md` |
| Terraform | `infra/terraform/README.md` |
| Observabilidade | `docs/observability.md` |
| Histórico da Fase 2 | `docs/phase-2-plan.md` |
| Segurança | `docs/security-report.md` |
| GAP Analysis Fase 2 | `docs/fase2-gap-analysis.md` |

## Observabilidade

O projeto possui observabilidade mínima viável:

- `/health` para saúde da aplicação e banco.
- `/metrics` no formato Prometheus.
- Métricas `requests_total`, `request_duration_seconds` e `healthcheck_status`.
- Prometheus e Grafana no Docker Compose.
- Dashboard inicial versionado para requisições, latência e health checks.

OpenTelemetry, Loki e Jaeger foram avaliados como evolução futura para evitar complexidade excessiva no escopo acadêmico atual. A proposta arquitetural está descrita em `docs/observability.md`.

## Autoria

Projeto desenvolvido como entrega do Tech Challenge Fase 2 da Pós-Tech FIAP em Arquitetura de Software.
