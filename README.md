# Oficina Tech Challenge

![Status](https://img.shields.io/badge/status-MVP-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![NestJS](https://img.shields.io/badge/NestJS-10-red)
![Coverage](https://img.shields.io/badge/coverage-86%25-brightgreen)

## Descricao do Projeto

Sistema back-end para gestao de oficinas mecanicas, desenvolvido como entrega do **Tech Challenge Fase 1** da pos-graduacao em Arquitetura de Software pela FIAP.

A aplicacao centraliza o fluxo operacional de uma oficina, contemplando cadastro de clientes, veiculos, ordens de servico, catalogo de servicos, controle de estoque de pecas/insumos e orcamentos dinamicos com maquina de estado completa.

---

## Objetivo

O sistema foi arquitetado para atender as seguintes necessidades de negocio:

- Cadastro e gestao unificada de clientes (CPF/CNPJ) e veiculos
- Criacao e acompanhamento de ordens de servico com maquina de estado
- Registro de diagnostico tecnico
- Inclusao e calculo automatico de servicos prestados
- Precificacao e consumo real de pecas e insumos com baixa de estoque
- Composicao detalhada de orcamento com fluxo de aprovacao

---

## Funcionalidades

### Customers

- Cadastro com validacao algoritmica de CPF e CNPJ
- Consulta por ID ou por documento (CPF/CNPJ)
- Listagem completa, atualizacao parcial e exclusao logica (soft delete)

### Vehicles

- Cadastro com validacao de placa (formato antigo e Mercosul)
- Vinculo obrigatorio com cliente existente
- Listagem, atualizacao parcial e exclusao logica

### Service Orders

- Criacao vinculada a cliente e veiculo ativos
- Criacao com identificacao do cliente por `customerId` ou CPF/CNPJ (`customerDocument`)
- Registro de diagnostico tecnico
- Adicao de servicos do catalogo e pecas do estoque
- Calculo automatico de orcamento
- Monitoramento do tempo medio de execucao das ordens finalizadas
- Fluxo completo com maquina de estado:

```
RECEIVED -> IN_DIAGNOSIS -> WAITING_APPROVAL -> IN_PROGRESS -> FINISHED -> DELIVERED
```

- Aprovacao de orcamento e consulta por CPF/CNPJ do cliente

### Stock Items

- Cadastro de pecas e insumos com SKU unico
- Controle de quantidade em estoque com baixa automatica ao vincular a OS
- Listagem, atualizacao e exclusao logica

### Service Catalog

- Cadastro de servicos com nome, descricao e preco
- Listagem, atualizacao e exclusao logica

---

## Tecnologias Utilizadas

| Tecnologia | Funcao |
|------------|--------|
| **Node.js + TypeScript** | Runtime e tipagem estatica |
| **NestJS** | Framework principal com IoC nativo |
| **Prisma ORM** | Camada de persistencia type-safe |
| **PostgreSQL** | Banco de dados relacional |
| **Swagger (OpenAPI)** | Documentacao automatica da API |
| **Helmet** | Hardening de headers HTTP |
| **class-validator / class-transformer** | Validacao de entrada via DTOs |
| **Jest + Supertest** | Testes unitarios e de integracao |
| **Docker + Docker Compose** | Containerizacao e orquestracao |
| **Trivy** | Analise estatica de vulnerabilidades |

---

## Justificativa Tecnologica

### Banco de Dados -- PostgreSQL

Adocao justificada por sua robustez transacional, forte suporte a integridade referencial nativa e adequacao a um dominio com entidades altamente interligadas (Ordens, Clientes, Veiculos, Pecas).

### ORM -- Prisma

Escolha baseada na maturidade da geracao automatica de tipagens (Type Safety), clareza esquematica e produtividade nas migracoes versionadas, reduzindo impedance mismatch entre dominio e persistencia.

### Framework -- NestJS

Estrutura opinativa e modular com injecao de dependencias nativa, impulsionando praticas de Separacao em Camadas e DDD sem atrito arquitetural, favorecendo integridade e testabilidade da API.

---

## Arquitetura do Sistema

O projeto adota uma estrutura em camadas baseada em **Domain-Driven Design (DDD)** para maximizar resiliencia a mudancas e protecao do nucleo de negocios:

- **Domain:** Coracao da aplicacao -- Entidades, Value Objects, Enums, regras de negocio e contratos de repositorio. Totalmente isolado de frameworks.
- **Application:** Orquestracao -- Casos de Uso, DTOs de entrada/saida e Mappers.
- **Interfaces/HTTP:** Controllers REST com decorators Swagger e guards de autenticacao.
- **Infrastructure:** Implementacoes concretas dos repositorios (Prisma) e filtros de excecao.
- **Shared:** Exceptions de dominio, filtros globais (Prisma/Domain) e servico singleton do banco.

Essa abordagem garante **baixo acoplamento** entre camadas, **alta coesao** dentro de cada modulo e **facilidade de manutencao**, permitindo que alteracoes em frameworks ou infraestrutura nao afetem as regras de negocio.

---

## Estrutura do Projeto

```text
src/
├── app.module.ts
├── main.ts
├── modules/
│   ├── auth/                  # Autenticacao JWT
│   ├── customers/             # Gestao de clientes (CPF/CNPJ)
│   ├── vehicles/              # Gestao de veiculos
│   ├── service-orders/        # Ordens de servico (core)
│   ├── stock-items/           # Pecas e insumos (estoque)
│   └── service-catalog/       # Catalogo de servicos
├── shared/
│   └── infrastructure/
│       ├── prisma/            # PrismaService singleton
│       └── filters/           # Exception filters globais
├── prisma/                    # Schema e migracoes
├── docs/                      # Documentacao DDD
└── test/                      # Testes unitarios e integracao
```

---

## Modelagem do Banco de Dados

A aplicacao modela de forma relacional estrita: `Customer`, `Vehicle`, `ServiceOrder`, `ServiceCatalog`, `StockItem`, integrados pelas tabelas associativas de composicao de ordens.

**Destaques Estruturais:**

- Integridade referencial entre cliente, veiculo e suas ordens de servico.
- Composicao da Ordem com `ServiceOrderService` (mao de obra baseada no catalogo).
- Calculo isolado de consumo via `ServiceOrderStockItem` (pecas/insumos com baixa real de inventario).
- Soft delete via campo `isActive` em Customer, Vehicle, ServiceCatalog e StockItem.

---

## Seguranca

O projeto incorpora praticas de seguranca em multiplas camadas, combinando hardening da aplicacao com analise estatica de vulnerabilidades.

### Medidas de Hardening Implementadas

- **JWT sem fallback hardcoded:** O `JWT_SECRET` e obrigatoriamente configurado via variavel de ambiente (`ConfigService.getOrThrow`). A aplicacao nao inicializa sem ele.
- **Helmet:** Headers HTTP de seguranca aplicados globalmente.
- **CORS:** Configuracao restritiva via variavel de ambiente `CORS_ORIGIN`.
- **Docker nao-root:** Dockerfile utiliza diretiva `USER node` para execucao nao privilegiada.
- **Validacao de entrada:** Todas as rotas utilizam `ValidationPipe` com `whitelist` e `forbidNonWhitelisted`.

### Arquitetura DDD e Seguranca Organica

A modelagem baseada em DDD contribui diretamente para a postura de seguranca do sistema:

- **Isolamento de Dependencias:** O nucleo de negocio (Domain) nao depende de frameworks externos, bloqueando infiltracoes por dependencias transitivas (Supply Chain).
- **Reducao da Superficie de Ataque:** Adapters HTTP e parsers de rotas ficam isolados e restritos logicamente.
- **Facilidade de Patching:** Casos de Uso sao independentes de atualizacoes de bibliotecas externas, mitigando quebras durante incidentes reativos.

### Resultado da Analise de Vulnerabilidades (Trivy)

Varredura executada com [Trivy](https://trivy.dev/) sobre o sistema de arquivos do projeto:

| Severidade | Quantidade |
|:-----------|:-----------|
| **CRITICAL** | 0 |
| **HIGH** | 2 |
| **MEDIUM** | 3 |
| **LOW** | 0 |
| **Total** | 5 |

**Observacao importante:** Todas as vulnerabilidades identificadas sao provenientes de **dependencias transitivas** -- bibliotecas indiretas herdadas por pacotes do ecossistema Node.js. Nenhuma vulnerabilidade se encontra no codigo-fonte da aplicacao.

**Exemplos de dependencias afetadas:**

- `lodash` -- Risco de poluicao de prototipo (Prototype Pollution)
- `path-to-regexp` -- Risco de ReDoS (Regular Expression Denial of Service) no Express
- `@hono/node-server` -- Risco de bypass em middleware de arquivos estaticos em versoes afetadas

**Estrategia adotada:** No contexto academico do Tech Challenge, priorizou-se a solidez arquitetural (DDD, separacao de camadas, testes) como principal mecanismo de defesa. As vulnerabilidades transitivas nao afetam a logica de negocio devido ao isolamento proporcionado pela arquitetura.

**Mitigacao recomendada para producao:**

```bash
# Correcao automatica de vulnerabilidades conhecidas
npm audit fix

# Auditoria detalhada
npm audit
```

### Executando o Scanner Local (Trivy)

O scanner requer Docker Desktop em execucao:

```bash
# Scan de dependencias e configuracoes
npm run scan:vuln

# Gerar relatorio exportado em arquivo
npm run scan:vuln:report

# Scan da imagem Docker
npm run scan:image
```

O relatorio completo esta disponivel em `trivy-report.txt`.

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

2. Suba o ambiente e inicie a aplicacao:

```bash
npm install
docker-compose up -d
npm run start:dev
```

3. Acesse a documentacao Swagger em: `http://localhost:3000/docs`

---

## Autenticacao (JWT)

A API possui rotas protegidas por **Bearer Token JWT**.

Para autenticacao via Swagger (`http://localhost:3000/docs`):

1. Acesse a rota publica: `POST /auth/login`
2. Envie o payload: `{"username": "admin", "password": "admin"}`
3. Copie o `access_token` retornado na resposta
4. Clique em **Authorize** no painel superior do Swagger e insira: `Bearer <token>`

---

## Entregaveis do Projeto (Fase 1)

| Entregavel | Localizacao |
|------------|-------------|
| Documentacao DDD -- Event Storming | [docs/event-storming.md](docs/event-storming.md) |
| Documentacao DDD -- Bounded Contexts | [docs/bounded-contexts.md](docs/bounded-contexts.md) |
| Documentacao DDD -- Linguagem Ubiqua | [docs/ubiquitous-language.md](docs/ubiquitous-language.md) |
| Documentacao DDD -- Arquitetura | [docs/architecture.md](docs/architecture.md) |
| Relatorio de Seguranca | [docs/security-report.md](docs/security-report.md) |
| Relatorio Trivy | [trivy-report.txt](trivy-report.txt) |
| Video de Demonstracao | Pendente de publicacao |

---

## Qualidade de Codigo e Testes

O projeto conta com uma suite abrangente de testes automatizados cobrindo todas as camadas da arquitetura.

### Estrategia de Testes

- **Testes Unitarios:** Entidades de dominio, Value Objects (validacao algoritmica de CPF/CNPJ, placa), Use Cases e Exception Filters.
- **Testes de Integracao:** Controllers HTTP via Supertest, validando rotas, status codes, guards e pipes de validacao.
- **Testes de Repositorio:** Repositories Prisma com mocks, garantindo cobertura da camada de infraestrutura.

### Comandos

```bash
# Executar todos os testes
npm test

# Executar com relatorio de cobertura
npm run test:cov
```

### Resultados

| Metrica | Valor |
|---------|-------|
| Test Suites | 54 |
| Tests | 185 |
| Passing | 100% |

### Cobertura de Codigo

| Metrica | Valor |
|---------|-------|
| Statements | 89.01% |
| Branches | 76.17% |
| Functions | 86.47% |
| Lines | 88.00% |

A cobertura atende ao criterio de qualidade estabelecido (meta >= 80% em statements, functions e lines).

---

## Qualidade de Codigo -- Analise Estatica (Opcional)

O projeto possui suporte para analise estatica com SonarQube via Docker:

```bash
docker-compose up -d sonarqube
```

A configuracao esta disponivel em `sonar-project.properties`. A ferramenta pode ser utilizada para identificacao de code smells, duplicacoes e acompanhamento de metricas de qualidade complementares ao Jest.

---

## Autoria

Projeto desenvolvido por **William Nascimento** como entrega do Tech Challenge Fase 1 -- Pos-graduacao em Arquitetura de Software, FIAP.
