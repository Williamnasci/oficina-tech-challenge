# Linguagem Ubíqua — Oficina Mecânica

Glossário de termos utilizados no sistema, com equivalência entre Português (domínio de negócio) e Inglês (código-fonte).

## Termos Principais

| Português (PT-BR) | Inglês (Código) | Descrição |
|--------------------|-----------------|-----------|
| Cliente | `Customer` | Pessoa física (CPF) ou jurídica (CNPJ) que contrata os serviços da oficina |
| Documento | `CustomerDocument` | CPF ou CNPJ com validação algorítmica |
| Tipo de Documento | `CustomerDocumentType` | Enum: CPF ou CNPJ |
| Veículo | `Vehicle` | Automóvel do cliente cadastrado no sistema |
| Placa | `LicensePlate` | Placa no formato antigo (ABC1234) ou Mercosul (ABC1D23) |
| Serviço | `ServiceCatalog` | Item do catálogo de serviços oferecidos pela oficina |
| Peça / Insumo | `StockItem` | Item físico em estoque (peças, óleos, filtros, etc.) |
| Estoque | `Stock / StockItem.quantity` | Quantidade disponível de uma peça/insumo |
| Ordem de Serviço (OS) | `ServiceOrder` | Registro do atendimento completo de um veículo |
| Diagnóstico | `diagnosis` | Avaliação técnica do problema do veículo |
| Orçamento | `Budget` | Composição de serviços e peças com preços calculados |
| Total de Serviços | `servicesAmount` | Soma dos preços dos serviços vinculados à OS |
| Total de Peças | `stockItemsAmount` | Soma dos preços das peças vinculadas à OS |
| Total Geral | `totalAmount` | Soma de serviços + peças |
| Tempo Médio de Execução | `averageExecutionTimeInMinutes` | Média do tempo entre início e finalização das ordens de serviço |
| Tempo Médio Formatado | `averageExecutionTimeFormatted` | Representação legível do tempo médio de execução |

## Status da Ordem de Serviço

| Português (PT-BR) | Inglês (Código) | Descrição |
|--------------------|-----------------|-----------|
| Recebida | `RECEIVED` | OS criada, veículo recebido na oficina |
| Em Diagnóstico | `IN_DIAGNOSIS` | Funcionário está avaliando o veículo |
| Aguardando Aprovação | `WAITING_APPROVAL` | Orçamento enviado ao cliente para aprovação |
| Em Execução | `IN_PROGRESS` | Cliente aprovou, serviço sendo realizado |
| Finalizada | `FINISHED` | Serviço concluído, pronto para entrega |
| Entregue | `DELIVERED` | Veículo devolvido ao cliente |

## Ações do Sistema

| Ação (PT-BR) | Método (Código) | Descrição |
|--------------|-----------------|-----------|
| Cadastrar Cliente | `CreateCustomerUseCase` | Criar registro do cliente com validação de CPF/CNPJ |
| Cadastrar Veículo | `CreateVehicleUseCase` | Criar registro do veículo com validação de placa |
| Criar OS | `CreateServiceOrderUseCase` | Abrir nova ordem de serviço |
| Registrar Diagnóstico | `RegisterDiagnosisUseCase` | Inserir diagnóstico técnico na OS |
| Adicionar Serviço à OS | `AddServiceToServiceOrderUseCase` | Vincular serviço do catálogo à OS |
| Adicionar Peça à OS | `AddStockItemToServiceOrderUseCase` | Vincular peça do estoque à OS (com baixa) |
| Enviar Orçamento | `SendBudgetForApprovalUseCase` | Enviar orçamento para aprovação do cliente |
| Aprovar Orçamento | `ApproveBudgetUseCase` | Cliente aceita o orçamento e autoriza o serviço |
| Iniciar Execução | `StartServiceOrderExecutionUseCase` | Iniciar o trabalho na OS |
| Finalizar OS | `FinishServiceOrderUseCase` | Marcar serviço como concluído |
| Entregar Veículo | `DeliverServiceOrderUseCase` | Entregar veículo ao cliente |
| Consultar OS | `GetServiceOrderUseCase` | Visualizar detalhes de uma OS |
| Buscar OS por Documento | `FindServiceOrdersByDocumentUseCase` | Buscar todas as OS de um cliente por CPF/CNPJ |
| Consultar Tempo Médio de Execução | `GetAverageExecutionTimeUseCase` | Calcular o tempo médio de execução das OS finalizadas |

## Conceitos Arquiteturais

| Conceito | Descrição |
|----------|-----------|
| **Entidade** | Objeto de domínio com identidade única (ex: `Customer`, `ServiceOrder`) |
| **Value Object** | Objeto imutável sem identidade (ex: `CustomerDocument`, `LicensePlate`) |
| **Agregado** | Cluster de entidades e VOs com fronteira de consistência |
| **Repositório** | Abstração para persistência de agregados |
| **Use Case** | Caso de uso da aplicação — orquestra entidades e repositórios |
| **Máquina de Estado** | Controle de transições de status da OS com guard clauses |
