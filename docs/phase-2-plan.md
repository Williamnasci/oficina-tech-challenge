# Plano da Fase 2

## Objetivo

Evoluir o backend da oficina mecanica para atender aos requisitos de qualidade, resiliencia, escalabilidade e automacao da Fase 2, preservando a arquitetura modular ja aplicada na Fase 1.

## Diagnostico Inicial

O projeto ja possui uma base consistente para a Fase 2:

- Backend NestJS com TypeScript.
- Separacao por modulos e camadas inspirada em Clean Architecture/DDD.
- Prisma com PostgreSQL.
- Autenticacao JWT.
- Swagger em `/docs`.
- Dockerfile e `docker-compose.yml`.
- Testes unitarios e de integracao.
- Documentacao de arquitetura, bounded contexts, event storming e linguagem ubiqua.

## Gaps Funcionais

Prioridade inicial no contexto de Ordens de Servico:

1. Abertura completa de OS recebendo dados do cliente, veiculo, servicos e pecas.
2. Consulta simples de status da OS.
3. Endpoint para decisao externa de orcamento, aceitando aprovacao ou recusa.
4. Listagem operacional de OS, ordenada por prioridade de status e antiguidade.
5. Atualizacao de status por notificacao externa, modelada inicialmente via webhook HTTP.

## Gaps de Infraestrutura

Entregas esperadas para a segunda etapa:

1. Revisao do Dockerfile e docker-compose. *(em andamento)*
2. Manifestos Kubernetes em `/k8s`. *(primeira versao criada)*
3. Scripts Terraform em `/infra`.
4. Pipeline CI/CD em `.github/workflows`.
5. README atualizado com arquitetura, execucao local, deploy, provisionamento e demonstracao.

## Decisoes Iniciais

- Manter o monolito modular, pois ele ja esta alinhado ao tamanho do dominio e facilita a entrega academica.
- Preservar os contratos REST atuais e adicionar endpoints especificos para a Fase 2.
- Representar notificacoes externas por endpoints HTTP, facilitando testes, CI e demonstracao em video.
- Implementar Kubernetes e Terraform de forma demonstravel em ambiente local ou cluster existente antes de evoluir para cloud.

## Sequencia Recomendada

1. Fechar os endpoints funcionais de Ordens de Servico.
2. Cobrir os novos fluxos com testes automatizados.
3. Revisar Docker e compose.
4. Criar manifestos Kubernetes.
5. Criar Terraform para provisionamento/aplicacao da infraestrutura.
6. Configurar CI/CD.
7. Atualizar README e preparar roteiro do video.
