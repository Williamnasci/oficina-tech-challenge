# Oficina Tech Challenge

## Descrição do Projeto

Este projeto consiste no desenvolvimento do back-end de um sistema integrado para gestão de oficinas mecânicas, como parte do Tech Challenge da pós-graduação em Arquitetura de Software.

A aplicação foi construída para centralizar e organizar o fluxo de atendimento da oficina, contemplando cadastro de clientes, veículos, ordens de serviço, catálogo de serviços, itens de estoque e composição do orçamento.

---

## Objetivo

O sistema foi projetado para atender às seguintes necessidades:

- Cadastro e gestão de clientes
- Cadastro e gestão de veículos
- Criação e acompanhamento de ordens de serviço
- Registro de diagnóstico técnico
- Controle do ciclo de vida da ordem de serviço
- Inclusão de serviços na ordem de serviço
- Inclusão de peças e insumos na ordem de serviço
- Controle de estoque
- Composição detalhada do orçamento

---

## Tecnologias Utilizadas

- Node.js
- TypeScript
- NestJS
- Prisma ORM
- PostgreSQL
- Swagger (OpenAPI)
- Helmet
- class-validator
- class-transformer
- Jest
- Supertest

---

## Justificativa Tecnológica

### Banco de Dados — PostgreSQL

O PostgreSQL foi escolhido como banco de dados relacional devido a:

- forte suporte a integridade referencial
- confiabilidade e consistência transacional
- adequação ao domínio com entidades fortemente relacionadas
- robustez para aplicações reais
- boa integração com Prisma

### ORM — Prisma

O Prisma foi adotado por:

- tipagem forte com TypeScript
- geração automática de client
- migrations versionadas
- clareza na modelagem do schema
- produtividade na camada de persistência

### Framework — NestJS

O NestJS foi escolhido por:

- estrutura modular
- suporte nativo a injeção de dependência
- facilidade para aplicar boas práticas arquiteturais
- integração com validação e Swagger
- boa aderência à separação em camadas e DDD

---

## Arquitetura do Sistema

O projeto foi organizado em camadas inspiradas em Domain-Driven Design (DDD):

- **domain**
  - entidades
  - enums
  - regras de negócio
  - contratos de repositório

- **application**
  - casos de uso
  - DTOs
  - mappers

- **interfaces/http**
  - controllers HTTP

- **infrastructure**
  - implementações de repositórios
  - integração com Prisma

- **shared**
  - componentes compartilhados
  - tratamento de exceções
  - PrismaService

---

## Estrutura do Projeto

```text
src/
├── app.module.ts
├── main.ts
├── modules/
│   ├── customers/
│   ├── vehicles/
│   ├── service-orders/
│   ├── stock-items/
│   └── service-catalog/
├── shared/
│   └── infrastructure/
│       ├── prisma/
│       └── filters/
├── prisma/
└── test/
```

---

## Modelagem do Banco de Dados

A aplicação possui persistência relacional para as seguintes entidades:

* Customer
* Vehicle
* ServiceOrder
* ServiceCatalog
* StockItem
* ServiceOrderService
* ServiceOrderStockItem

### Características da modelagem

* relacionamento entre cliente, veículo e ordem de serviço
* catálogo de serviços com preço base
* catálogo de peças e insumos com estoque
* composição detalhada da ordem de serviço
* cálculo de totais por serviços e itens
* baixa de estoque ao adicionar peça na ordem

---

## Funcionalidades Implementadas

### Customers

* criar cliente
* buscar cliente

### Vehicles

* criar veículo
* buscar veículo
* buscar por placa

### Service Orders

* criar ordem de serviço
* buscar ordem de serviço por ID
* registrar diagnóstico
* enviar orçamento para aprovação
* iniciar execução
* finalizar ordem
* entregar veículo
* adicionar serviço à ordem
* adicionar peça/insumo à ordem
* visualizar ordem detalhada com composição de itens

### Stock Items

* criar item de estoque
* listar itens ativos
* buscar item por ID
* atualizar item
* excluir logicamente (inativar)

### Service Catalog

* criar serviço
* listar serviços ativos
* buscar serviço por ID
* atualizar serviço
* excluir logicamente (inativar)

---

## Regras de Negócio

* não é possível enviar orçamento sem diagnóstico
* não é possível iniciar execução sem aprovação
* não é possível finalizar sem estar em execução
* não é possível entregar sem finalizar
* não é possível adicionar item sem estoque suficiente
* exclusão de serviços e itens foi implementada como exclusão lógica (`isActive = false`)

---

## Configuração do Ambiente

### Pré-requisitos

* Node.js instalado
* PostgreSQL instalado
* npm instalado

### Banco de Dados

Criar o banco localmente:

```sql
CREATE DATABASE oficina_db;
```

### Variáveis de Ambiente

Criar um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5433/oficina_db?schema=public"
PORT=3000
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1d
```

---

## Instalação

Instalar dependências:

```bash
npm install
```

Gerar client do Prisma:

```bash
npx prisma generate
```

Executar migrations:

```bash
npx prisma migrate dev
```

---

## Execução via Docker (Recomendado)

O projeto conta com o `Dockerfile` e `docker-compose.yml` para facilitar a execução local, orquestrando o banco e a API.

```bash
docker-compose up -d --build
```

---

## Execução Local (NPM)

Rodar aplicação em desenvolvimento:

```bash
npm run start:dev
```

Aplicação disponível em:

```text
http://localhost:3000
```

---

## Autenticação (JWT)

A API possui endpoints administrativos protegidos por **Bearer Token (JWT)**, garantindo os requisitos de segurança.

Para efetuar chamadas (inclusive no Swagger):
1. Acesse `POST /auth/login`
2. Utilize o payload padrão de admin:
```json
{
  "username": "admin",
  "password": "admin"
}
```
3. Copie o `access_token`.
4. No Swagger, clique em **Authorize** no topo da página e cole o token.

---

## Entregáveis do Tech Challenge (Fase 1)

Os itens cobrados além do código-fonte (este repositório) estão mapeados abaixo:

* **Vídeo Demonstrativo (Até 15min):** [Adicionar Link do Vídeo Aqui]
* **Documentação DDD (Event Storming e Fluxos):** [Adicionar Link do Miro Aqui]
* **Relatório de Análise de Vulnerabilidades:** [Sua ferramenta aqui - SonarQube/Trivy]

---

## Documentação da API

Swagger disponível em:

```text
http://localhost:3000/docs
```

---

## Testes Automatizados

Rodar todos os testes:

```bash
npm test
```

Rodar em modo watch:

```bash
npm run test:watch
```

Gerar cobertura:

```bash
npm run test:cov
```

O projeto possui testes unitários e de integração cobrindo regras de domínio e endpoints principais.

---

## Status do Projeto

Projeto em evolução contínua, com MVP funcional cobrindo os principais requisitos do desafio.

---

## Autor

William Nascimento
