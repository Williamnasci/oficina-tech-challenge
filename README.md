# Oficina Tech Challenge

![Status](https://img.shields.io/badge/status-MVP-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![NestJS](https://img.shields.io/badge/NestJS-10-red)
![Coverage](https://img.shields.io/badge/coverage-89%25-brightgreen)

## Descrição do Projeto

Sistema back-end para gestão de oficinas mecânicas, desenvolvido como entrega do **Tech Challenge Fase 1** da pós-graduação em Arquitetura de Software da FIAP.

A aplicação centraliza o fluxo operacional de uma oficina, contemplando cadastro de clientes, veículos, ordens de serviço, catálogo de serviços, controle de estoque de peças e insumos, além de orçamentos dinâmicos com máquina de estado completa.

---

## Objetivo

O sistema foi arquitetado para atender as seguintes necessidades de negócio:

- Cadastro e gestão unificada de clientes (CPF/CNPJ) e veículos
- Criação e acompanhamento de ordens de serviço com máquina de estado
- Registro de diagnóstico técnico
- Inclusão e cálculo automático de serviços prestados
- Precificação e consumo real de peças e insumos, com baixa de estoque
- Composição detalhada de orçamento com fluxo de aprovação

---

## Funcionalidades

### Customers

- Cadastro com validação algorítmica de CPF e CNPJ
- Consulta por ID ou por documento (CPF/CNPJ)
- Listagem completa, atualização parcial e exclusão lógica (soft delete)

### Vehicles

- Cadastro com validação de placa (formato antigo e Mercosul)
- Vínculo obrigatório com cliente existente
- Listagem, atualização parcial e exclusão lógica

### Service Orders

- Criação vinculada a cliente e veículo ativos
- Criação com identificação do cliente por `customerId` ou CPF/CNPJ (`customerDocument`)
- Registro de diagnóstico técnico
- Adição de serviços do catálogo e peças do estoque
- Cálculo automático de orçamento
- Monitoramento do tempo médio de execução das ordens finalizadas
- Fluxo completo com máquina de estado:

```
RECEIVED -> IN_DIAGNOSIS -> WAITING_APPROVAL -> IN_PROGRESS -> FINISHED -> DELIVERED
```

- Aprovação de orçamento e consulta por CPF/CNPJ do cliente

### Stock Items

- Cadastro de peças e insumos com SKU único
- Controle de quantidade em estoque com baixa automática ao vincular a OS
- Listagem, atualização e exclusão lógica

### Service Catalog

- Cadastro de serviços com nome, descrição e preço
- Listagem, atualização e exclusão lógica

---

## Tecnologias Utilizadas

| Tecnologia | Função |
|------------|--------|
| **Node.js + TypeScript** | Runtime e tipagem estática |
| **NestJS** | Framework principal com IoC nativo |
| **Prisma ORM** | Camada de persistência type-safe |
| **PostgreSQL** | Banco de dados relacional |
| **Swagger (OpenAPI)** | Documentação automática da API |
| **Helmet** | Hardening de headers HTTP |
| **class-validator / class-transformer** | Validação de entrada via DTOs |
| **Jest + Supertest** | Testes unitários e de integração |
| **Docker + Docker Compose** | Containerização e orquestração |
| **Trivy** | Análise estática de vulnerabilidades |

---

## Justificativa Tecnológica

### Banco de Dados - PostgreSQL

Adoção justificada por sua robustez transacional, forte suporte à integridade referencial nativa e adequação a um domínio com entidades altamente interligadas (ordens, clientes, veículos e peças).

### ORM - Prisma

Escolha baseada na maturidade da geração automática de tipagens (type safety), na clareza esquemática e na produtividade das migrações versionadas, reduzindo o impedance mismatch entre domínio e persistência.

### Framework - NestJS

Estrutura opinativa e modular, com injeção de dependências nativa, impulsionando práticas de separação em camadas e DDD sem atrito arquitetural, favorecendo a integridade e a testabilidade da API.

---

## Arquitetura do Sistema

O projeto adota uma estrutura em camadas baseada em **Domain-Driven Design (DDD)** para maximizar a resiliência a mudanças e a proteção do núcleo de negócios:

- **Domain:** Coração da aplicação; entidades, value objects, enums, regras de negócio e contratos de repositório. Não depende de NestJS, Prisma, Swagger, DTOs de aplicação ou adapters externos.
- **Application:** Orquestração; casos de uso, DTOs de entrada/saída e mappers. Nesta implementação NestJS, os casos de uso usam decorators de injeção de dependência como decisão pragmática, sem depender de Prisma ou repositórios concretos.
- **Interfaces/HTTP:** Controllers REST com decorators Swagger e guards de autenticação.
- **Infrastructure:** Implementações concretas dos repositórios (Prisma) e filtros de exceção.
- **Shared:** Exceptions de domínio, filtros globais (Prisma/Domain) e serviço singleton do banco.

Essa abordagem garante **baixo acoplamento** entre as camadas, **alta coesão** dentro de cada módulo e **facilidade de manutenção**. As regras centrais ficam no domínio e nos casos de uso; detalhes como HTTP, Swagger, Prisma e persistência transacional ficam nas camadas externas.

---

## Estrutura do Projeto

```text
src/
├── app.module.ts
├── main.ts
├── modules/
│   ├── auth/                  # Autenticação JWT
│   ├── customers/             # Gestão de clientes (CPF/CNPJ)
│   ├── vehicles/              # Gestão de veículos
│   ├── service-orders/        # Ordens de serviço (core)
│   ├── stock-items/           # Peças e insumos (estoque)
│   └── service-catalog/       # Catálogo de serviços
├── shared/
│   └── infrastructure/
│       ├── prisma/            # PrismaService singleton
│       └── filters/           # Exception filters globais
├── prisma/                    # Schema e migrações
├── docs/                      # Documentação DDD
└── test/                      # Testes unitários e de integração
```

---

## Modelagem do Banco de Dados

A aplicação modela de forma relacional estrita: `Customer`, `Vehicle`, `ServiceOrder`, `ServiceCatalog` e `StockItem`, integrados pelas tabelas associativas de composição de ordens.

**Destaques Estruturais:**

- Integridade referencial entre cliente, veículo e suas ordens de serviço.
- Composição da ordem com `ServiceOrderService` (mão de obra baseada no catálogo).
- Cálculo isolado de consumo via `ServiceOrderStockItem` (peças e insumos com baixa real de inventário). A baixa de estoque e a atualização dos itens da OS são executadas no adapter Prisma dentro de transação para preservar atomicidade.
- Soft delete via campo `isActive` em Customer, Vehicle, ServiceCatalog e StockItem.

---

## Segurança

O projeto incorpora práticas de segurança em múltiplas camadas, combinando hardening da aplicação com análise estática de vulnerabilidades.

### Medidas de Hardening Implementadas

- **JWT sem fallback hardcoded:** O `JWT_SECRET` é obrigatoriamente configurado por meio de variável de ambiente (`ConfigService.getOrThrow`). A aplicação não inicializa sem ele.
- **Helmet:** Headers HTTP de segurança aplicados globalmente.
- **CORS:** Configuração restritiva via variável de ambiente `CORS_ORIGIN`.
- **Docker não root:** o Dockerfile utiliza a diretiva `USER node` para execução não privilegiada.
- **Validação de entrada:** Todas as rotas utilizam `ValidationPipe` com `whitelist` e `forbidNonWhitelisted`.

### Arquitetura DDD e Segurança Orgânica

A modelagem baseada em DDD contribui diretamente para a postura de segurança do sistema:

- **Isolamento de dependências:** o núcleo de negócio (Domain) não depende de frameworks externos, DTOs de aplicação ou ORM, bloqueando infiltrações por dependências transitivas (supply chain).
- **Redução da superfície de ataque:** adapters HTTP e parsers de rotas ficam isolados e restritos logicamente.
- **Facilidade de patching:** casos de uso dependem de contratos abstratos de repositório, mitigando quebras quando bibliotecas externas ou adapters concretos são atualizados.

### Resultado da Análise de Vulnerabilidades (Trivy)

Varredura executada com [Trivy](https://trivy.dev/) sobre o sistema de arquivos do projeto:

| Severidade | Quantidade |
|:-----------|:-----------|
| **CRITICAL** | 0 |
| **HIGH** | 2 |
| **MEDIUM** | 3 |
| **LOW** | 0 |
| **Total** | 5 |

**Observação importante:** todas as vulnerabilidades identificadas são provenientes de **dependências transitivas** - bibliotecas indiretas herdadas por pacotes do ecossistema Node.js. Nenhuma vulnerabilidade se encontra no código-fonte da aplicação.

**Exemplos de dependências afetadas:**

- `lodash` - risco de poluição de protótipo (prototype pollution)
- `path-to-regexp` - risco de ReDoS (Regular Expression Denial of Service) no Express
- `@hono/node-server` - risco de bypass em middleware de arquivos estáticos em versões afetadas

**Estratégia adotada:** no contexto acadêmico do Tech Challenge, priorizou-se a solidez arquitetural (DDD, separação de camadas, testes) como principal mecanismo de defesa. As vulnerabilidades transitivas não afetam a lógica de negócio devido ao isolamento proporcionado pela arquitetura.

**Mitigação recomendada para produção:**

```bash
# Correção automática de vulnerabilidades conhecidas
npm audit fix

# Auditoria detalhada
npm audit
```

### Executando o Scanner Local (Trivy)

O scanner requer Docker Desktop em execução:

```bash
# Scan de dependências e configurações
npm run scan:vuln

# Gerar relatório exportado em arquivo
npm run scan:vuln:report

# Scan da imagem Docker
npm run scan:image
```

O relatório completo está disponível em `trivy-report.txt`.

---

## Como Executar

1. Configure o arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5433/oficina_db?schema=public"
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:3000
PORT=3000
```

2. Suba o ambiente e inicie a aplicação:

```bash
npm install
docker-compose up -d
npm run start:dev
```

3. Acesse a documentação Swagger em: `http://localhost:3000/docs`

---

## Autenticação (JWT)

A API possui rotas protegidas por **Bearer Token JWT**.

Para autenticação via Swagger (`http://localhost:3000/docs`):

1. Acesse a rota pública: `POST /auth/login`
2. Envie o payload: `{"username": "admin", "password": "admin"}`
3. Copie o `access_token` retornado na resposta
4. Clique em **Authorize** no painel superior do Swagger e insira: `Bearer <token>`

---

## Entregáveis do Projeto (Fase 1)

| Entregável | Localização |
|------------|-------------|
| Documentação DDD - Event Storming | [docs/event-storming.md](docs/event-storming.md) |
| Documentação DDD - Bounded Contexts | [docs/bounded-contexts.md](docs/bounded-contexts.md) |
| Documentação DDD - Linguagem Ubíqua | [docs/ubiquitous-language.md](docs/ubiquitous-language.md) |
| Documentação DDD - Arquitetura | [docs/architecture.md](docs/architecture.md) |
| Relatório de Segurança | [docs/security-report.md](docs/security-report.md) |
| Relatório Trivy | [trivy-report.txt](trivy-report.txt) |
| Vídeo de Demonstração | [Apresentação](https://drive.google.com/file/d/1TP-5E37EJjAbyQwcOiKJv8tjguq1LDrq/view?usp=sharing) |

---

## Qualidade de Código e Testes

O projeto conta com uma suíte abrangente de testes automatizados cobrindo todas as camadas da arquitetura.

### Estratégia de Testes

- **Testes unitários:** entidades de domínio, value objects (validação algorítmica de CPF/CNPJ e placa), use cases e exception filters.
- **Testes de integração:** controllers HTTP via Supertest, validando rotas, status codes, guards e pipes de validação.
- **Testes de repositório:** repositórios Prisma com mocks, garantindo cobertura da camada de infraestrutura.

### Comandos

```bash
# Executar todos os testes
npm test

# Executar com relatório de cobertura
npm run test:cov
```

### Resultados

| Métrica | Valor |
|---------|-------|
| Test Suites | 54 |
| Tests | 185 |
| Passing | 100% |

### Cobertura de Código

| Métrica | Valor |
|---------|-------|
| Statements | 89.01% |
| Branches | 76.17% |
| Functions | 86.47% |
| Lines | 88.00% |

A cobertura atende ao critério de qualidade estabelecido (meta >= 80% em statements, functions e lines).

---

## Qualidade de Código - Análise Estática (Opcional)

O projeto possui suporte para análise estática com SonarQube via Docker:

```bash
docker-compose up -d sonarqube
```

A configuração está disponível em `sonar-project.properties`. A ferramenta pode ser utilizada para identificação de code smells, duplicações e acompanhamento de métricas de qualidade complementares ao Jest.

---

## Autoria

Projeto desenvolvido por **William Nascimento** como entrega do Tech Challenge Fase 1 - Pós-graduação em Arquitetura de Software, FIAP.
