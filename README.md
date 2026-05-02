# Oficina Tech Challenge

![Status](https://img.shields.io/badge/status-MVP-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![NestJS](https://img.shields.io/badge/NestJS-10-red)
![Coverage](https://img.shields.io/badge/coverage-86%25-brightgreen)

## Descrição do Projeto

Sistema back-end para gestão de oficinas mecânicas, desenvolvido como entrega do **Tech Challenge Fase 1** da pós-graduação em Arquitetura de Software pela FIAP.

A aplicação centraliza o fluxo operacional de uma oficina, contemplando cadastro de clientes, veículos, ordens de serviço, catálogo de serviços, controle de estoque de peças/insumos e orçamentos dinâmicos com máquina de estado completa.

---

## Objetivo

O sistema foi arquitetado para atender as seguintes necessidades de negócio:

- Cadastro e gestão unificada de clientes (CPF/CNPJ) e veículos
- Criação e acompanhamento de ordens de serviço com máquina de estado
- Registro de diagnóstico técnico
- Inclusão e cálculo automático de serviços prestados
- Precificação e consumo real de peças e insumos com baixa de estoque
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
- Registro de diagnóstico técnico
- Adição de serviços do catálogo e peças do estoque
- Cálculo automático de orçamento
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

### Banco de Dados -- PostgreSQL

Adoção justificada por sua robustez transacional, forte suporte à integridade referencial nativa e adequação a um domínio com entidades altamente interligadas (Ordens, Clientes, Veículos, Peças).

### ORM -- Prisma

Escolha baseada na maturidade da geração automática de tipagens (Type Safety), clareza esquemática e produtividade nas migrações versionadas, reduzindo impedance mismatch entre domínio e persistência.

### Framework -- NestJS

Estrutura opinativa e modular com injeção de dependências nativa, impulsionando práticas de separação em camadas e DDD sem atrito arquitetural, favorecendo integridade e testabilidade da API.

---

## Arquitetura do Sistema

O projeto adota uma estrutura em camadas baseada em **Domain-Driven Design (DDD)** para maximizar resiliência a mudanças e proteção do núcleo de negócios:

- **Domain:** Coração da aplicação -- Entidades, Value Objects, Enums, regras de negócio e contratos de repositório. Totalmente isolado de frameworks.
- **Application:** Orquestração -- Casos de Uso, DTOs de entrada/saída e Mappers.
- **Interfaces/HTTP:** Controllers REST com decorators Swagger e guards de autenticação.
- **Infrastructure:** Implementações concretas dos repositórios (Prisma) e filtros de exceção.
- **Shared:** Exceptions de domínio, filtros globais (Prisma/Domain) e serviço singleton do banco.

Essa abordagem garante **baixo acoplamento** entre camadas, **alta coesão** dentro de cada módulo e **facilidade de manutenção**, permitindo que alterações em frameworks ou infraestrutura não afetem as regras de negócio.

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

A aplicação modela de forma relacional estrita: `Customer`, `Vehicle`, `ServiceOrder`, `ServiceCatalog`, `StockItem`, integrados pelas tabelas associativas de composição de ordens.

**Destaques Estruturais:**

- Integridade referencial entre cliente, veículo e suas ordens de serviço.
- Composição da Ordem com `ServiceOrderService` (mão de obra baseada no catálogo).
- Cálculo isolado de consumo via `ServiceOrderStockItem` (peças/insumos com baixa real de inventário).
- Soft delete via campo `isActive` em Customer, Vehicle, ServiceCatalog e StockItem.

---

## Segurança

O projeto incorpora práticas de segurança em múltiplas camadas, combinando hardening da aplicação com análise estática de vulnerabilidades.

### Medidas de Hardening Implementadas

- **JWT sem fallback hardcoded:** O `JWT_SECRET` é obrigatoriamente configurado via variável de ambiente (`ConfigService.getOrThrow`). A aplicação não inicializa sem ele.
- **Helmet:** Headers HTTP de segurança aplicados globalmente.
- **CORS:** Configuração restritiva via variável de ambiente `CORS_ORIGIN`.
- **Docker não-root:** Dockerfile utiliza diretiva `USER node` para execução não privilegiada.
- **Validação de entrada:** Todas as rotas utilizam `ValidationPipe` com `whitelist` e `forbidNonWhitelisted`.

### Arquitetura DDD e Segurança Orgânica

A modelagem baseada em DDD contribui diretamente para a postura de segurança do sistema:

- **Isolamento de Dependências:** O núcleo de negócio (Domain) não depende de frameworks externos, bloqueando infiltrações por dependências transitivas (Supply Chain).
- **Redução da Superfície de Ataque:** Adapters HTTP e parsers de rotas ficam isolados e restritos logicamente.
- **Facilidade de Patching:** Casos de Uso são independentes de atualizações de bibliotecas externas, mitigando quebras durante incidentes reativos.

### Resultado da Análise de Vulnerabilidades (Trivy)

Varredura executada com [Trivy](https://trivy.dev/) sobre o sistema de arquivos do projeto:

| Severidade | Quantidade |
|:-----------|:-----------|
| **CRITICAL** | 0 |
| **HIGH** | 13 |
| **MEDIUM** | 5 |
| **LOW** | 2 |
| **Total** | 20 |

**Observação importante:** Todas as vulnerabilidades identificadas são provenientes de **dependências transitivas** -- bibliotecas indiretas herdadas por pacotes do ecossistema Node.js. Nenhuma vulnerabilidade se encontra no código-fonte da aplicação.

**Exemplos de dependências afetadas:**

- `lodash` -- Risco de poluição de protótipo (Prototype Pollution)
- `path-to-regexp` -- Risco de ReDoS (Regular Expression Denial of Service) no Express
- `glob`, `tar`, `minimatch` -- Vulnerabilidades de traversal e parsing

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
| Test Suites | 53 |
| Tests | 167 |
| Passing | 100% |

### Cobertura de Codigo

| Metrica | Valor |
|---------|-------|
| Statements | 86.47% |
| Branches | 74.72% |
| Functions | 83.58% |
| Lines | 85.13% |

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
