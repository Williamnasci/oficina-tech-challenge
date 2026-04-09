# Oficina Tech Challenge

![Security](https://img.shields.io/badge/security-scan%20enabled-green)
![Status](https://img.shields.io/badge/status-MVP-blue)

## Descrição do Projeto

Este projeto consiste no desenvolvimento do back-end de um sistema integrado para gestão de oficinas mecânicas, construído com práticas avançadas de arquitetura para o Tech Challenge da pós-graduação em Arquitetura de Software.

A aplicação atua como núcleo de controle, centralizando e organizando o fluxo de atendimento da oficina de modo seguro e modular, contemplando cadastro de clientes, veículos, ordens de serviço, catálogo de serviços, itens de estoque e orçamentos dinâmicos.

---

## Objetivo

O sistema foi arquitetado para suportar as complexidades diárias de uma oficina com eficiência, atendendo às seguintes necessidades de negócio:

- Cadastro e gestão unificada de clientes e veículos
- Criação e acompanhamento em máquina de estado de ordens de serviço
- Registro minucioso de diagnóstico técnico
- Inclusão e cálculo de serviços prestados
- Precificação e consumo real de peças e insumos em estoque
- Composição detalhada e controle flexível do orçamento

---

## Tecnologias Utilizadas

- **Node.js & TypeScript**
- **NestJS** (Framework core)
- **Prisma ORM** (Camada de persistência)
- **PostgreSQL**
- **Swagger (OpenAPI)**
- **Helmet** (Security Headers)
- **class-validator / class-transformer**
- **Jest & Supertest** (Unit and e2e testing)

---

## Justificativa Tecnológica

### Banco de Dados — PostgreSQL
Adoção justificada por sua robustez transacional, forte suporte a integridade referencial nativa e adequação perfeita a um domínio central com entidades altamente interligadas (Ordens, Itens, Clientes, Empregados).

### ORM — Prisma
Escolha baseada na maturidade da geração automática de tipagens (`Type Safety`), clareza esquemática, e extrema produtividade nas migrações versionadas, reduzindo "impedance mismatch".

### Framework — NestJS
Sua estrutura opinativa e modular fornece injeção de dependências "out-of-the-box", impulsionando práticas como Separação em Camadas e DDD sem atrito arquitetural, e favorecendo integridade e testabilidade da API.

---

## Arquitetura do Sistema

O projeto adota uma estrutura em camadas inspirada em **Domain-Driven Design (DDD)** para maximizar resiliência a mudanças e proteção do núcleo de negócios:

- **Domain:** O coração da aplicação (Entidades, Enums, Regras e Contratos). Totalmente isolado de frameworks e impedimentos externos.
- **Application:** Orquestradora dos Modelos. Onde fluem os Casos de Uso, DTOs de entrada e Mappers.
- **Interfaces/HTTP:** Concentra os Controllers para interceptar a malha de rotas e segurança REST.
- **Infrastructure:** Camada densa com as implementações concretas dos Repositórios e chamadas do Prisma.
- **Shared:** Ponto em comum de Exceptions, Filtros e instâncias singleton do banco.

---

## Estrutura do Projeto

```text
src/
├── app.module.ts
├── main.ts
├── modules/
│   ├── auth/
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

A aplicação modela de forma relacional estrita: `Customer`, `Vehicle`, `ServiceOrder`, `ServiceCatalog`, `StockItem`, integrados pelas tabelas associativas de composição de ordens.

**Destaques Estruturais:**
* Integridade entre veículo do cliente e suas ordens de serviço.
* Composição fina da Ordem com `ServiceOrderService` (mão de obra baseada no catálogo).
* Cálculo isolado de consumo tangível via `ServiceOrderStockItem` (Peças/Insumos com baixa real de inventário pós-aprovação).

---

## 🔐 Segurança

O projeto possui scripts automatizados para análise estática de vulnerabilidades e inspeção contínua (DevSecOps), utilizando ativamente ferramentas open source como o [Trivy](https://trivy.dev/) e [SonarQube](https://www.sonarqube.org/).

### 🛡️ Arquitetura DDD e Segurança Orgânica

A modelagem baseada em **Domain-Driven Design (DDD)** implementada neste projeto contribui ativamente para a segurança robusta e resiliente e manutenibilidade do sistema:
* **Isolamento de Dependências:** O núcleo de negócio (Domain) não depende de frameworks externos. Bibliotecas genéricas não infectam a regra de negócio central, bloqueando infiltrações por dependências (Supply Chain).
* **Redução da Superfície de Ataque:** Adapters HTTP e parsers de rotas ficam isolados e restritos logicamente.
* **Facilidade de Manutenção e Patching:** Módulo de Use Cases são independentes de atualizações de segurança severas, mitigando quebras no sistema inteiro durante incidentes reativos de bibliotecas externas.

### 📊 Resultado do Scan Base (Trivy)

Varredura inicial sem intervenção de patching:

| Severidade | Quantidade |
| :--- | :--- |
| **CRITICAL** | 0 |
| **HIGH** | 2 |
| **MEDIUM** | 3 |
| **LOW** | 0 |
| **Total** | 5 |

**Principais ocorrências detectadas mitigáveis:**
* `lodash` → Risco de execução de código arbitrário.
* `path-to-regexp` → Risco de falha viabilizando requisições DoS (Denial of Service) algorítmicas no Express.

### 📈 Evolução da Segurança

Demonstração prática do avanço estrutural e ganho de maturidade após o comissionamento das rotinas DevSecOps:

| Momento | Vulnerabilidades Ativas | Ações Realizadas |
| :--- | :--- | :--- |
| **Antes** | 5 | Estado legado, base desatualizada sem auditoria transparente. |
| **Depois** | **0** | Fix de NPM rodado proativamente, adoção de práticas de hardening em containers (ex: Alpine otimizado) e adoção do Helmet para hardening de headers HTTP. |

### Executando o Scanner Local (Trivy)

O scanner pode ser executado via Docker (recomendado) ou por instalação local do binário do Trivy na sua máquina host.

**1. Scan de Arquivos (Dependências e Configurações)**
```bash
npm run scan:vuln
```

**2. Gerar Relatório Exportado em Arquivo**
```bash
npm run scan:vuln:report
```

**3. Scan da Infraestrutura e Imagem Docker**
```bash
npm run scan:image
```

*Os sumários consolidados de nossa auditoria oficial também podem ser acessados em [docs/security-report.md](docs/security-report.md).*

### Mitigações Essenciais
Em caso de quebras por rotinas em modo de desenvolvimento Node:
```bash
npm audit fix
```

### Análise SonarQube
O projeto viabiliza subir um ambiente de avaliação sonarqube de forma enclausurada e controlada:
```bash
docker-compose up -d sonarqube
```
Com uso atrelado ao `sonar-project.properties`.

---

## Configuração e Inicialização

O sistema foi preparado para rodar sob mínima complexidade operacional.

### Variáveis de Ambiente (`.env`)
```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5433/oficina_db?schema=public"
PORT=3000
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1d
```

### Orquestração Rápida (Docker Composto Recomendado)
O ecossistema provisiona o Banco PostgreSQL, efetua a automigração pelo Prisma e liga o backend sozinho:
```bash
docker-compose up -d --build
```
*(Se preferir rodar desvinculado, execute `npm install` + `npm run start:dev` após prover o banco locamente e efetuar `npx prisma migrate dev`).*

---

## Autenticação (JWT)

A API possui endpoints e áreas blindadas por **Bearer Token JWT** robustos. 

Para navegação via Swagger (`http://localhost:3000/docs`):
1. Acesse a rota pública: `POST /auth/login`
2. Gere um admin dummy payload `{"username": "admin", "password": "admin"}`.
3. Extraia o `access_token` gerado na devolutiva da requisição.
4. Acione **Authorize** no painel superior do Swagger.

---

## Entregáveis do Projeto (Fase 1)

Os ativos associados fundamentais desta documentação encontram-se sumarizados:

* **Vídeo Demonstrativo (Arquitetura):** [Adicionar Link do Vídeo Aqui]
* **Documentação DDD (Event Storming e Fluxos):** [Adicionar Link do Miro Aqui]
* **Relatórios e Artefatos (Segurança):** [docs/security-report.md](docs/security-report.md)

---

## Gestão de Qualidade de Código (Testes)

Para provar o modelo lógico de domínio contra regressões imprevistas, garantimos uma extensa malha de testes unificados sobre as Entidades, Use Cases Vitais, Value Objects (validações algorítmicas de negócio puro como CNPJ) e Regras do Controller Administrativo.

```bash
# Executa todos os pre-checks isolados
npm test

# Avalia matriz de detecção / branch coverage
npm run test:cov
```

O projeto entrega MVP com índices rigorosos que aferem estabilidade inquebrável nos núcleos dos requisitos principais.

---

## Autoria

Projeto assinado por e de exclusividade de **William Nascimento**.
