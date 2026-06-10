# Domain Storytelling - Oficina Mecânica

## Objetivo

Este documento descreve, em formato narrativo, o fluxo principal do domínio da Oficina Mecânica. O objetivo é complementar a documentação de DDD, Event Storming e Bounded Contexts, deixando explícita a colaboração entre atores, sistema e agregados no ciclo de vida da ordem de serviço.

## Atores

| Ator | Responsabilidade |
|------|------------------|
| Funcionário da Oficina | Registra clientes, veículos, diagnóstico, serviços, peças e evolução da ordem de serviço |
| Cliente | Solicita atendimento, acompanha a ordem de serviço e aprova ou recusa o orçamento |
| Sistema | Valida regras de negócio, calcula orçamento, baixa estoque e mantém o estado da ordem de serviço |

## História Principal

### 1. Abertura da Ordem de Serviço

O cliente chega à oficina solicitando atendimento para um veículo.

O funcionário identifica ou cadastra o cliente, registra o veículo e abre uma ordem de serviço. A ordem inicia no estado `RECEIVED`.

Regras envolvidas:

- O cliente deve existir e estar ativo.
- O veículo deve existir, estar ativo e pertencer ao cliente informado.
- A ordem de serviço referencia cliente e veículo por identificadores.

### 2. Diagnóstico

Após receber o veículo, o funcionário registra o diagnóstico técnico.

A ordem passa para o estado `IN_DIAGNOSIS`, permitindo que serviços e peças sejam associados à ordem.

Regras envolvidas:

- O diagnóstico não pode ser vazio.
- O diagnóstico antecede o envio do orçamento para aprovação.

### 3. Composição do Orçamento

O funcionário adiciona serviços do catálogo e peças do estoque à ordem de serviço.

O sistema calcula automaticamente:

- valor total dos serviços;
- valor total das peças;
- valor total do orçamento.

Regras envolvidas:

- O serviço deve existir e estar ativo.
- A peça deve existir e estar ativa.
- A quantidade solicitada deve ser válida.
- O orçamento é recalculado quando serviços ou peças são adicionados.

### 4. Baixa de Estoque

Ao adicionar uma peça à ordem de serviço, o sistema realiza a baixa de estoque.

Essa operação ocorre de forma transacional junto com o vínculo da peça à ordem e o recálculo do orçamento.

Regras envolvidas:

- Não é permitido consumir quantidade maior que o estoque disponível.
- Em caso de estoque insuficiente, a operação falha e o estoque permanece inalterado.
- O teste de integração transacional valida esse comportamento com PostgreSQL real.

### 5. Aprovação do Orçamento

Com o diagnóstico e os itens definidos, o funcionário envia o orçamento para aprovação.

A ordem passa para `WAITING_APPROVAL`. O cliente pode aprovar ou recusar o orçamento.

Quando o orçamento é aprovado, a ordem passa para `IN_PROGRESS` e a execução do serviço é iniciada.

Regras envolvidas:

- O orçamento só pode ser aprovado quando a ordem está aguardando aprovação.
- A aprovação registra o início da execução.
- Transições inválidas de status são bloqueadas pela entidade de domínio.

### 6. Execução e Finalização

Com a ordem em execução, a oficina realiza o serviço aprovado.

Ao concluir o trabalho, o funcionário finaliza a ordem, que passa para `FINISHED`.

Regras envolvidas:

- Apenas ordens em execução podem ser finalizadas.
- A finalização registra o momento usado para cálculo de tempo médio de execução.

### 7. Entrega do Veículo

Após a finalização, o veículo é entregue ao cliente.

A ordem passa para `DELIVERED`, encerrando o ciclo principal da ordem de serviço.

Regras envolvidas:

- Apenas ordens finalizadas podem ser entregues.
- A entrega representa o encerramento operacional do atendimento.

## Fluxo Resumido

```text
Cliente solicita atendimento
  -> Funcionário abre ordem de serviço
  -> Funcionário registra diagnóstico
  -> Funcionário adiciona serviços e peças
  -> Sistema calcula orçamento e baixa estoque
  -> Funcionário envia orçamento
  -> Cliente aprova orçamento
  -> Sistema inicia execução
  -> Funcionário finaliza serviço
  -> Funcionário entrega veículo
```

## Estados da Ordem de Serviço

```text
RECEIVED -> IN_DIAGNOSIS -> WAITING_APPROVAL -> IN_PROGRESS -> FINISHED -> DELIVERED
```

## Relação com a Implementação

| História | Implementação |
|----------|---------------|
| Abertura da ordem | `OpenServiceOrderUseCase` e `CreateServiceOrderUseCase` |
| Diagnóstico | `RegisterDiagnosisUseCase` |
| Inclusão de serviços | `AddServiceToServiceOrderUseCase` |
| Inclusão de peças e baixa de estoque | `AddStockItemToServiceOrderUseCase` e repositório Prisma transacional |
| Envio do orçamento | `SendBudgetForApprovalUseCase` |
| Aprovação do orçamento | `ApproveBudgetUseCase` |
| Finalização | `FinishServiceOrderUseCase` |
| Entrega | `DeliverServiceOrderUseCase` |
| Regras de status | Entidade `ServiceOrder` |

## Observação

O fluxo descrito está coberto por testes automatizados, incluindo teste de integração real para orçamento, aprovação e baixa de estoque usando Prisma e PostgreSQL.
