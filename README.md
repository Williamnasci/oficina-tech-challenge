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
RECEIVED -> IN_DIAGNOSIS -> WAITING_APPROVAL -> IN_PROGRESS -> FINISHED -> DELIVERED
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

Para acesso ao PostgreSQL pelo host local, o Compose expõe o banco em `localhost:15432`.

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

A implementação Terraform fica em `infra/terraform/` e provisiona recursos equivalentes em um cluster Kubernetes local:

- Namespace `oficina-terraform`.
- ConfigMap.
- Secret.
- PostgreSQL Service.
- PostgreSQL StatefulSet.
- PersistentVolumeClaim.
- API Deployment.
- API Service.
- HPA via `kubernetes_horizontal_pod_autoscaler_v2`.

Comandos principais:

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
docker build -t oficina-tech-challenge:test .
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

O HPA está criado e associado ao Deployment da API.

Em clusters locais sem `metrics-server`, os targets de CPU e memória podem aparecer como `<unknown>`. Isso não invalida o provisionamento do HPA; apenas indica que o cluster não está expondo a API de métricas necessária para o cálculo dinâmico.

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

Secrets necessários no GitHub:

```text
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
```

## Segurança

- JWT obrigatório via `JWT_SECRET`.
- Helmet aplicado globalmente.
- CORS configurável por variável de ambiente.
- Docker executando como usuário não root.
- Validação de entrada com `ValidationPipe`.
- Trivy executado no pipeline.
- Relatório complementar em `docs/security-report.md`.

## Como Executar Localmente

1. Configure o arquivo `.env`:

```env
DATABASE_URL="postgresql://postgres:supersecretpassword@localhost:15432/oficina_db?schema=public"
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=1d
AUTH_DEMO_USERNAME=admin
AUTH_DEMO_PASSWORD=admin
CORS_ORIGIN=http://localhost:3000
PORT=3000
```

2. Suba o ambiente:

```bash
npm install
docker compose up -d db
npm run start:dev
```

3. Acesse:

- API: `http://localhost:3000`
- Health check: `http://localhost:3000/health`
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

Última validação local registrada:

- 59 suítes de teste.
- 206 testes automatizados.

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
| Histórico da Fase 2 | `docs/phase-2-plan.md` |
| Segurança | `docs/security-report.md` |

## Observabilidade

Prometheus, Grafana, Loki, Jaeger e OpenTelemetry não fazem parte da implementação atual consolidada. São evoluções possíveis para uma próxima etapa.

## Autoria

Projeto desenvolvido como entrega do Tech Challenge Fase 2 da Pós-Tech FIAP em Arquitetura de Software.
