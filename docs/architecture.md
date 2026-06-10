# Arquitetura do Sistema — Oficina Mecânica

## Visão Geral

O sistema é um **backend monolítico** construído com **NestJS**, aplicando conceitos de **Domain-Driven Design (DDD)** e **Clean Architecture** para garantir separação de responsabilidades, testabilidade e manutenibilidade.

## Stack Tecnológica

| Componente | Tecnologia | Justificativa |
|------------|------------|---------------|
| Framework | NestJS | IoC nativo, modularidade, decorators, ecosistema TypeScript maduro |
| ORM | Prisma | Type-safe, migrations automáticas, excelente DX |
| Banco de Dados | PostgreSQL | Robusto, ACID compliance, suporte a transações complexas |
| Autenticação | JWT + Passport | Stateless, padrão de mercado para APIs REST |
| Testes | Jest + Supertest | Framework de testes padrão do ecossistema Node.js |
| Container | Docker + Docker Compose | Portabilidade e reprodutibilidade do ambiente |
| Documentação | Swagger (OpenAPI) | Autodocumentação da API via decorators |

## Decisões Arquiteturais

### 1. Monolito Modular (e não microserviços)

**Decisão:** Adotar uma arquitetura monolítica modular.

**Justificativa:** Para o escopo acadêmico do Tech Challenge, a complexidade de um sistema distribuído não se justifica. O monolito modular permite desenvolvimento objetivo, deploys simples e compartilhamento de transações ACID via Prisma, enquanto os módulos bem delimitados preservam baixo acoplamento e facilitam uma futura decomposição se necessário.

### 2. DDD Tático (Entidades, VOs, Repositórios)

**Decisão:** Aplicar DDD no nível tático dentro de cada módulo.

**Justificativa:**
- **Entidades ricas** (`ServiceOrder`, `Customer`, `Vehicle`) encapsulam regras de negócio (ex: máquina de estado da OS)
- **Value Objects** (`CustomerDocument`, `LicensePlate`) garantem validação e imutabilidade
- **Repositórios abstratos** no domínio com implementações na infraestrutura preservam o princípio de inversão de dependência

### 3. Separação em Camadas (por módulo)

**Decisão:** Cada módulo segue a estrutura:

```
modules/<module>/
├── domain/           → Entidades, Enums, Value Objects, contratos de repositório
├── application/      → Use Cases, DTOs
├── infrastructure/   → Implementações Prisma dos repositórios
└── interfaces/       → Controllers HTTP
```

**Justificativa:**
- O domínio **não depende** de frameworks (NestJS, Prisma), DTOs de aplicação ou adapters externos.
- As dependências apontam de fora para dentro (Dependency Rule da Clean Arch) nos contratos e entidades de domínio.
- A camada de aplicação usa recursos de DI do NestJS como decisão pragmática, mas depende de contratos abstratos, não de Prisma ou repositórios concretos.
- Troca de ORM ou framework web não deve afetar regras centrais de negócio, embora adapters e configuração de DI precisem ser atualizados.

### 4. Repository Pattern com Abstract Classes

**Decisão:** Usar `abstract class` em vez de interfaces TypeScript para os contratos de repositório.

**Justificativa:** No NestJS, abstract classes funcionam como token de injeção de dependência nativamente (via `@Inject()`), enquanto interfaces TypeScript são apagadas em runtime e exigem `InjectionToken` manual.

### 5. Soft Delete

**Decisão:** Implementar exclusão lógica (`isActive = false`) em vez de exclusão física.

**Justificativa:** Preservar histórico e integridade referencial. Uma OS antiga que referencia um cliente ou veículo excluído não deve quebrar.

### 6. Autenticação JWT com rotas públicas

**Decisão:** Proteger rotas administrativas com JWT e manter consultas de OS públicas.

**Justificativa:**
- Funcionários (administradores) autenticam via `POST /auth/login`
- Clientes podem consultar suas OS via `GET /service-orders/:id` ou `GET /service-orders?document=xxx` sem login
- Guards aplicados via `@UseGuards(JwtAuthGuard)` em cada rota protegida

### 7. Transações Atômicas para OS

**Decisão:** Usar `prisma.$transaction()` para operações que afetam múltiplas tabelas.

**Justificativa:** Adicionar peça à OS envolve: criar/atualizar `ServiceOrderStockItem`, decrementar `StockItem.quantity` e recalcular `ServiceOrder.totalAmount`. Sem transação, uma falha parcial deixaria dados inconsistentes.

### 8. Métricas Operacionais no Contexto de OS

**Decisão:** Expor a métrica de tempo médio de execução em `GET /service-orders/metrics/average-execution-time`.

**Justificativa:** O requisito de monitoramento operacional pertence ao contexto de Ordem de Serviço. A métrica utiliza ordens com `startedAt` e `finishedAt`, mantendo a leitura no repositório e a formatação no caso de uso `GetAverageExecutionTimeUseCase`.

## Diagrama de Camadas

```
┌─────────────────────────────────────────────────┐
│                 INTERFACES                       │
│  Controllers HTTP + Swagger Decorators           │
│  (Validação de entrada via DTOs + Pipes)         │
├─────────────────────────────────────────────────┤
│                 APPLICATION                      │
│  Use Cases (orquestração)                        │
│  DTOs (entrada/saída)                            │
├─────────────────────────────────────────────────┤
│                 DOMAIN                           │
│  Entidades + Value Objects + Enums               │
│  Regras de negócio + Contratos de repositório    │
├─────────────────────────────────────────────────┤
│               INFRASTRUCTURE                     │
│  Prisma Repositories + Filters + PrismaService   │
├─────────────────────────────────────────────────┤
│                 DATABASE                         │
│  PostgreSQL                                      │
└─────────────────────────────────────────────────┘
```

## Cobertura de Testes

| Tipo | Escopo | Ferramenta |
|------|--------|------------|
| Unitário | Entidades, VOs, Use Cases, Repositories (mock), Filters | Jest |
| Integração | Controllers via HTTP (Supertest) | Jest + Supertest |

**Meta:** ≥ 80% em statements, lines e functions.

**Resultado atual:** a última validação local executou 59 suítes e 206 testes com sucesso. A suíte inclui testes unitários e de integração, incluindo fluxo transacional real de orçamento e baixa de estoque.
