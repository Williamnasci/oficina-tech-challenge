# Event Storming — Oficina Mecânica

## Atores

| Ator | Descrição |
|------|-----------|
| **Funcionário da Oficina** | Usuário autenticado que gerencia o sistema |
| **Cliente** | Pessoa física ou jurídica que contrata serviços da oficina |
| **Sistema** | Processos automáticos (cálculos, validações) |

---

## Fluxo Principal: Ordem de Serviço

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       FLUXO DE ORDEM DE SERVIÇO                        │
│                                                                         │
│  [Cliente chega]                                                        │
│       │                                                                 │
│       ▼                                                                 │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐              │
│  │ Cadastrar   │───▶│ Cadastrar    │───▶│ Criar Ordem   │              │
│  │ Cliente     │    │ Veículo      │    │ de Serviço    │              │
│  │ (CPF/CNPJ)  │    │ (Placa)      │    │ (RECEBIDA)    │              │
│  └─────────────┘    └──────────────┘    └───────┬───────┘              │
│                                                  │                      │
│                                                  ▼                      │
│                                         ┌───────────────┐              │
│                                         │ Registrar     │              │
│                                         │ Diagnóstico   │              │
│                                         │(EM_DIAGNÓSTICO)│             │
│                                         └───────┬───────┘              │
│                                                  │                      │
│                                    ┌─────────────┼─────────────┐       │
│                                    ▼             ▼             ▼       │
│                              ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│                              │ Incluir  │ │ Incluir  │ │ Enviar   │  │
│                              │ Serviços │ │ Peças    │ │ Orçamento│  │
│                              └──────────┘ └──────────┘ └────┬─────┘  │
│                                                              │        │
│                                                              ▼        │
│                                                    ┌──────────────┐   │
│                                                    │  AGUARDANDO  │   │
│                                                    │  APROVAÇÃO   │   │
│                                                    └──────┬───────┘   │
│                                                           │           │
│                                              ┌────────────┘           │
│                                              ▼                        │
│                                    ┌──────────────┐                   │
│                                    │ Aprovar      │                   │
│                                    │ Orçamento    │                   │
│                                    │(EM_EXECUÇÃO) │                   │
│                                    └──────┬───────┘                   │
│                                           │                           │
│                                           ▼                           │
│                                    ┌──────────────┐                   │
│                                    │ Finalizar    │                   │
│                                    │ OS           │                   │
│                                    │(FINALIZADA)  │                   │
│                                    └──────┬───────┘                   │
│                                           │                           │
│                                           ▼                           │
│                                    ┌──────────────┐                   │
│                                    │ Entregar     │                   │
│                                    │ Veículo      │                   │
│                                    │(ENTREGUE)    │                   │
│                                    └──────────────┘                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Eventos de Domínio

| Evento | Comando | Ator | Agregado |
|--------|---------|------|----------|
| `ClienteCadastrado` | Cadastrar Cliente | Funcionário | Customer |
| `VeiculoCadastrado` | Cadastrar Veículo | Funcionário | Vehicle |
| `OrdemDeServicoRecebida` | Criar OS | Funcionário | ServiceOrder |
| `DiagnosticoRegistrado` | Registrar Diagnóstico | Funcionário | ServiceOrder |
| `ServicoAdicionado` | Adicionar Serviço à OS | Funcionário | ServiceOrder |
| `PecaAdicionada` | Adicionar Peça à OS | Funcionário/Sistema | ServiceOrder |
| `EstoqueBaixado` | (automático ao adicionar peça) | Sistema | StockItem |
| `OrcamentoCalculado` | (automático) | Sistema | ServiceOrder |
| `OrcamentoEnviado` | Enviar Orçamento | Funcionário | ServiceOrder |
| `OrcamentoAprovado` | Aprovar Orçamento | Cliente | ServiceOrder |
| `ExecucaoIniciada` | Aprovar Orçamento / Iniciar Execução | Cliente/Funcionário/Sistema | ServiceOrder |
| `OrdemFinalizada` | Finalizar OS | Funcionário | ServiceOrder |
| `VeiculoEntregue` | Entregar Veículo | Funcionário | ServiceOrder |
| `TempoMedioExecucaoConsultado` | Consultar Tempo Médio de Execução | Funcionário | ServiceOrder |

---

## Comandos

| Comando | Input | Regras |
|---------|-------|--------|
| `CadastrarCliente` | nome, CPF/CNPJ, telefone, email | CPF/CNPJ com validação algorítmica |
| `CadastrarVeiculo` | placa, marca, modelo, ano, clienteId | Placa no formato antigo ou Mercosul |
| `CriarOrdemDeServico` | customerId ou customerDocument, vehicleId | Cliente e veículo devem existir; veículo deve pertencer ao cliente |
| `RegistrarDiagnostico` | serviceOrderId, diagnosis | Diagnóstico não pode ser vazio |
| `AdicionarServico` | serviceOrderId, serviceId, quantity | Serviço deve existir e estar ativo |
| `AdicionarPeca` | serviceOrderId, stockItemId, quantity | Peça deve existir, estoque suficiente |
| `EnviarOrcamento` | serviceOrderId | Diagnóstico deve estar registrado |
| `AprovarOrcamento` | serviceOrderId | Status deve ser AGUARDANDO_APROVACAO; OS muda para EM_EXECUCAO |
| `IniciarExecucao` | serviceOrderId | Rota operacional alternativa; status deve ser AGUARDANDO_APROVACAO |
| `FinalizarOS` | serviceOrderId | Status deve ser EM_EXECUCAO |
| `EntregarVeiculo` | serviceOrderId | Status deve ser FINALIZADA |
| `ConsultarTempoMedioExecucao` | - | Considera OS com data de início e finalização |

---

## Políticas

| Política | Gatilho | Ação |
|----------|---------|------|
| **Recálculo de Orçamento** | Serviço ou peça adicionados à OS | Recalcular `servicesAmount`, `stockItemsAmount`, `totalAmount` |
| **Baixa de Estoque** | Peça adicionada à OS | Decrementar quantidade no estoque |
| **Autenticação Obrigatória** | Qualquer operação administrativa | Validar JWT token |
| **Consulta Pública** | Busca de OS por ID ou CPF/CNPJ | Sem autenticação necessária |
| **Monitoramento Operacional** | Consulta administrativa de métricas | Calcular tempo médio de execução das OS finalizadas |
