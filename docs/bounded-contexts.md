# Bounded Contexts — Oficina Mecânica

## Contextos Delimitados

### 1. Gestão de Clientes (Customer Management)

**Responsabilidade:** Cadastro e manutenção de dados de clientes.

**Agregados:**
- `Customer` (raiz)
  - `CustomerDocument` (Value Object — CPF/CNPJ)

**Operações:** CRUD completo, busca por documento.

**Regras:**
- CPF deve ter 11 dígitos e ser validado algoritmicamente
- CNPJ deve ter 14 dígitos e ser validado algoritmicamente
- Nome é obrigatório

---

### 2. Gestão de Veículos (Vehicle Management)

**Responsabilidade:** Cadastro e manutenção de veículos dos clientes.

**Agregados:**
- `Vehicle` (raiz)
  - `LicensePlate` (Value Object)

**Operações:** CRUD completo.

**Regras:**
- Placa deve estar no formato antigo (`ABC1234`) ou Mercosul (`ABC1D23`)
- Veículo pertence a um cliente (FK)

---

### 3. Catálogo de Serviços (Service Catalog)

**Responsabilidade:** Gestão dos serviços oferecidos pela oficina.

**Agregados:**
- `ServiceCatalog` (raiz)

**Operações:** CRUD completo.

**Regras:**
- Nome e preço são obrigatórios
- Preço não pode ser negativo
- Serviço pode ser desativado (soft delete)

---

### 4. Gestão de Estoque (Stock Management)

**Responsabilidade:** Controle de peças e insumos em estoque.

**Agregados:**
- `StockItem` (raiz)

**Operações:** CRUD completo, baixa de estoque (via OS).

**Regras:**
- Quantidade não pode ser negativa
- Preço unitário não pode ser negativo
- SKU deve ser único
- Item pode ser desativado (soft delete)

---

### 5. Ordem de Serviço (Service Order — CORE)

**Responsabilidade:** Gestão completa do ciclo de vida da ordem de serviço.

**Agregados:**
- `ServiceOrder` (raiz)
  - `ServiceOrderService` (item de serviço vinculado)
  - `ServiceOrderStockItem` (item de estoque vinculado)

**Operações:** Criar, adicionar serviços/peças, diagnóstico, orçamento, aprovação, execução, finalização, entrega, consulta.

**Regras:**
- Máquina de estado rígida: `RECEIVED → IN_DIAGNOSIS → WAITING_APPROVAL → IN_PROGRESS → FINISHED → DELIVERED`
- Diagnóstico é obrigatório antes do orçamento
- Orçamento só pode ser aprovado quando em `WAITING_APPROVAL`
- Cálculo automático de totais (domínio)
- Baixa de estoque é transacional

---

## Mapa de Contextos

```
┌─────────────────┐        ┌─────────────────────┐
│   Gestão de     │◄───────│   Gestão de         │
│   Clientes      │  1:N   │   Veículos          │
│  (Customer)     │────────│  (Vehicle)           │
└────────┬────────┘        └──────────┬──────────┘
         │                            │
         │  referência                │  referência
         │  (customerId)             │  (vehicleId)
         ▼                            ▼
┌────────────────────────────────────────────────┐
│                                                │
│          ORDEM DE SERVIÇO (CORE)               │
│          ServiceOrder Aggregate                │
│                                                │
│  ┌─────────────┐      ┌──────────────────┐    │
│  │ OS Services │      │ OS Stock Items   │    │
│  └──────┬──────┘      └────────┬─────────┘    │
│         │                      │               │
└─────────┼──────────────────────┼───────────────┘
          │  referência          │  referência +
          │  (serviceId)         │  baixa de estoque
          ▼                      ▼
┌─────────────────┐   ┌─────────────────────┐
│   Catálogo de   │   │   Gestão de         │
│   Serviços      │   │   Estoque           │
│ (ServiceCatalog)│   │  (StockItem)        │
└─────────────────┘   └─────────────────────┘
```

## Relações entre Contextos

| De | Para | Tipo | Descrição |
|----|------|------|-----------|
| ServiceOrder | Customer | **Conformist** | OS referencia cliente por ID |
| ServiceOrder | Vehicle | **Conformist** | OS referencia veículo por ID |
| ServiceOrder | ServiceCatalog | **Customer-Supplier** | OS consome catálogo para precificar serviços |
| ServiceOrder | StockItem | **Customer-Supplier** | OS consome e baixa estoque de peças |
| Vehicle | Customer | **Conformist** | Veículo pertence a um cliente |
