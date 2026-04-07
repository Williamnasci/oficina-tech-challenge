# Oficina Tech Challenge

## Descrição do Projeto

Este projeto consiste no desenvolvimento do back-end de um sistema integrado para gestão de oficinas mecânicas, como parte do Tech Challenge da pós-graduação em Arquitetura de Software.

A aplicação tem como objetivo centralizar e organizar o fluxo de atendimento de clientes, controle de veículos, execução de serviços e gestão de ordens de serviço, promovendo maior eficiência operacional e rastreabilidade das atividades realizadas.

---

## Objetivo

O sistema foi projetado para atender às seguintes necessidades:

* Cadastro e gestão de clientes
* Cadastro e gestão de veículos
* Criação e acompanhamento de ordens de serviço
* Registro de diagnóstico técnico
* Controle do ciclo de vida da ordem de serviço
* Gestão de serviços prestados
* Gestão de peças e insumos
* Controle de estoque
* Composição detalhada de orçamento

---

## Tecnologias Utilizadas

* Node.js
* TypeScript
* NestJS
* Prisma ORM
* PostgreSQL
* Swagger (OpenAPI)
* Helmet
* class-validator
* class-transformer

---

## Justificativa Tecnológica

### Banco de Dados — PostgreSQL

O PostgreSQL foi escolhido como banco de dados relacional devido às seguintes características:

* Forte suporte a integridade referencial
* Confiabilidade e consistência transacional (ACID)
* Excelente adequação para modelagem relacional complexa
* Ampla compatibilidade com ORMs modernos (como Prisma)
* Escalabilidade e robustez para aplicações reais

Dado que o domínio do problema envolve múltiplas entidades com forte relacionamento (clientes, veículos, ordens de serviço, serviços e peças), a abordagem relacional se mostrou a mais adequada.

---

### ORM — Prisma

O Prisma foi utilizado como ORM devido a:

* Facilidade de integração com TypeScript
* Tipagem forte e geração automática de client
* Sistema de migrations versionadas
* Clareza na definição do schema
* Redução de complexidade na camada de persistência

---

### Framework — NestJS

O NestJS foi adotado por:

* Estrutura modular e organizada
* Suporte nativo a injeção de dependência
* Facilidade de aplicação de boas práticas arquiteturais
* Integração com validação, interceptors e middlewares
* Aderência a princípios de Clean Architecture e DDD

---

## Arquitetura do Sistema

O projeto segue uma arquitetura em camadas inspirada em Domain-Driven Design (DDD), com separação clara de responsabilidades.

### Camadas

* **Domain**

  * Entidades
  * Enums
  * Regras de negócio
  * Contratos de repositório

* **Application**

  * Casos de uso
  * DTOs
  * Mappers

* **Interfaces (HTTP)**

  * Controllers
  * Entrada e saída da API

* **Infrastructure**

  * Implementação de repositórios
  * Integração com banco de dados (Prisma)

* **Shared**

  * Componentes reutilizáveis (ex: PrismaService)

---

## Estrutura do Projeto

```text
src/
├── app.module.ts
├── main.ts
├── modules/
│   ├── customers/
│   ├── vehicles/
│   └── service-orders/
├── shared/
│   └── infrastructure/
│       └── prisma/
└── prisma/
```

---

## Modelagem do Banco de Dados

O sistema possui persistência relacional com as seguintes entidades principais:

* Customer
* Vehicle
* ServiceOrder
* ServiceCatalog
* StockItem
* ServiceOrderService
* ServiceOrderStockItem

### Características da Modelagem

* Relacionamento entre cliente, veículo e ordem de serviço
* Catálogo de serviços com preço base
* Controle de estoque de peças e insumos
* Registro detalhado dos itens associados à ordem de serviço
* Cálculo de valores totais baseado na composição da OS

---

## Funcionalidades Implementadas

### Ordens de Serviço

* Criar ordem de serviço
* Buscar ordem de serviço por ID
* Registrar diagnóstico
* Enviar orçamento para aprovação
* Iniciar execução
* Finalizar ordem
* Entregar veículo

### Regras de Negócio

* Não é possível enviar orçamento sem diagnóstico
* Não é possível iniciar execução sem aprovação
* Não é possível finalizar sem estar em execução
* Não é possível entregar sem finalizar

---

## Configuração do Ambiente

### Pré-requisitos

* Node.js instalado
* PostgreSQL instalado
* npm instalado

---

### Banco de Dados

Criar o banco localmente:

```sql
CREATE DATABASE oficina_db;
```

---

### Variáveis de Ambiente

Criar um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5433/oficina_db?schema=public"
PORT=3000
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

## Execução

Rodar aplicação em ambiente de desenvolvimento:

```bash
npm run start:dev
```

A aplicação estará disponível em:

```
http://localhost:3000
```

---

## Documentação da API

A documentação da API está disponível via Swagger:

```
http://localhost:3000/docs
```

---

## Status do Projeto

O projeto encontra-se em evolução contínua, com expansão das funcionalidades relacionadas a:

* composição da ordem de serviço
* controle de estoque
* integração entre serviços e peças
* melhoria da camada de aplicação

---

## Considerações Finais

A solução proposta atende aos requisitos do desafio ao fornecer uma base estruturada, escalável e alinhada com boas práticas de arquitetura de software, garantindo separação de responsabilidades, manutenibilidade e evolução contínua do sistema.

---

## Autor

William Nascimento
