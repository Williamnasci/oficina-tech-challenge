# Fase 2 - GAP Analysis

## Objetivo

Registrar os GAPs identificados em relacao ao conteudo da Pos Tech FIAP - Software Architecture - Fase 2, as evidencias encontradas, as correcoes aplicadas e o impacto tecnico para avaliacao.

## GAP 1 - README inconsistente

**GAP encontrado:** o README descrevia um fluxo local que podia misturar API local com servicos Docker sem deixar claro o risco de conflito na porta `3000`.

**Evidencia:** README orientava `npm install`, `docker compose up -d db` e `npm run start:dev`, mas nao separava esse fluxo do Compose completo. A porta oficial do PostgreSQL ja estava em `15432` no Compose e `.env.example`.

**Correcao aplicada:** README passou a documentar dois fluxos:

- Fluxo Docker Completo: `docker compose up -d --build`.
- Fluxo Desenvolvimento Local: `docker compose up -d db` e `npm run start:dev`.

**Arquivos alterados:** `README.md`.

**Beneficio tecnico:** reduz conflito de porta e deixa explicito quando a API roda em container ou localmente.

**Impacto para avaliacao FIAP:** melhora reprodutibilidade da execucao local e clareza operacional.

## GAP 2 - Docker Compose

**GAP encontrado:** `docker-compose.yml` ainda usava `version: '3.8'`, campo obsoleto no Docker Compose v2.

**Evidencia:** primeira linha do Compose declarava a versao.

**Correcao aplicada:** removida a declaracao `version` e adicionados Prometheus/Grafana como servicos do Compose.

**Arquivos alterados:** `docker-compose.yml`.

**Beneficio tecnico:** elimina warning de Compose v2 e moderniza a configuracao local.

**Impacto para avaliacao FIAP:** demonstra aderencia a praticas atuais de containerizacao.

## GAP 3 - Sonar

**GAP encontrado:** havia `sonar-project.properties` e SonarQube no Compose, mas a automacao principal de CI nao executa Sonar.

**Evidencia:** `sonar-project.properties` configura fontes, testes, exclusoes e cobertura Jest; `.github/workflows/ci-cd.yml` executa Jest, build, Docker e Trivy, mas nao possui job Sonar.

**Correcao aplicada:** mantida a configuracao Sonar local/manual e documentado no README que a analise automatizada de seguranca e feita por Trivy, enquanto cobertura e qualidade funcional sao medidas por Jest/build.

**Arquivos alterados:** `README.md`.

**Beneficio tecnico:** evita prometer uma automacao inexistente e preserva a possibilidade de analise local no SonarQube.

**Impacto para avaliacao FIAP:** deixa transparente a fronteira entre ferramenta provisionada e ferramenta efetivamente usada no pipeline.

## GAP 4 - Observabilidade

**GAP encontrado:** o projeto declarava que Prometheus, Grafana, Loki, Jaeger e OpenTelemetry eram evolucoes futuras, sem uma solucao implementada de metricas tecnicas.

**Evidencia:** README, `docs/phase-2-plan.md` e `infra/terraform/README.md` tratavam observabilidade completa como fora do escopo atual.

**Correcao aplicada:** implementada observabilidade minima viavel:

- endpoint `/metrics`;
- metricas `requests_total`, `request_duration_seconds` e `healthcheck_status`;
- metricas padrao Node.js com prefixo `oficina_`;
- Prometheus no Docker Compose;
- Grafana no Docker Compose;
- dashboard inicial versionado;
- anotacoes Prometheus nos manifests Kubernetes e Terraform.

**Arquivos alterados:** `src/observability/*`, `src/app.module.ts`, `src/app.service.ts`, `docker-compose.yml`, `monitoring/*`, `k8s/04-api-deployment.yaml`, `infra/terraform/main.tf`, `docs/observability.md`, `README.md`, `docs/architecture.md`, `docs/phase-2-plan.md`, `docs/kubernetes.md`, `infra/terraform/README.md`.

**Beneficio tecnico:** adiciona visibilidade de trafego, latencia e saude da API sem alterar regras de negocio.

**Impacto para avaliacao FIAP:** cobre diretamente o conteudo de Prometheus/Grafana e estabelece arquitetura futura para OpenTelemetry, Loki e Jaeger.

## GAP 5 - Seguranca

**GAP encontrado:** o relatorio de seguranca nao registrava a validacao apos as alteracoes nem citava o endpoint `/metrics`.

**Evidencia:** `docs/security-report.md` descrevia controles gerais e Trivy, mas nao a nova superficie de observabilidade.

**Correcao aplicada:** atualizado o relatorio para registrar que `/metrics` expoe somente metricas agregadas sem dados sensiveis, que `npm audit --audit-level=high` nao encontrou HIGH/CRITICAL e que o Trivy filesystem scan retornou 0 vulnerabilidades HIGH/CRITICAL em `package-lock.json`.

**Arquivos alterados:** `docs/security-report.md`, `package.json`, `package-lock.json`.

**Beneficio tecnico:** mantem registro de risco atualizado e evita aplicar `npm audit fix --force` sem validacao de breaking changes.

**Impacto para avaliacao FIAP:** demonstra analise de seguranca consciente, com mitigacoes e risco documentado.

## GAP 6 - Kubernetes

**GAP encontrado:** os manifests eram funcionais, mas nao tinham indicacao para coleta Prometheus.

**Evidencia:** `k8s/04-api-deployment.yaml` possuia probes em `/health`, mas nao anotacoes de scrape.

**Correcao aplicada:** adicionadas anotacoes `prometheus.io/scrape`, `prometheus.io/path` e `prometheus.io/port` no template do Deployment.

**Arquivos alterados:** `k8s/04-api-deployment.yaml`, `docs/kubernetes.md`.

**Beneficio tecnico:** prepara a API para coleta por Prometheus em clusters Kubernetes.

**Impacto para avaliacao FIAP:** conecta Kubernetes ao pilar de observabilidade estudado na Fase 2.

## GAP 7 - Terraform

**GAP encontrado:** a infraestrutura Terraform reproduzia API, PostgreSQL e HPA, mas nao carregava configuracao de observabilidade no pod.

**Evidencia:** `infra/terraform/main.tf` nao tinha anotacoes Prometheus no template do Deployment.

**Correcao aplicada:** adicionadas anotacoes `prometheus.io/*` equivalentes as dos manifests Kubernetes.

**Arquivos alterados:** `infra/terraform/main.tf`, `infra/terraform/README.md`.

**Beneficio tecnico:** mantem equivalencia entre manifests Kubernetes e recursos criados por Terraform.

**Impacto para avaliacao FIAP:** reforca Infraestrutura como Codigo alinhada aos requisitos de operacao.

## GAP 8 - Documentacao final

**GAP encontrado:** a documentacao nao refletia observabilidade implementada e nao havia relatorio consolidado de GAPs.

**Evidencia:** README e documentos da Fase 2 ainda tratavam observabilidade como futura.

**Correcao aplicada:** criados/atualizados documentos finais:

- `docs/observability.md`;
- `docs/fase2-gap-analysis.md`;
- `README.md`;
- `docs/architecture.md`;
- `docs/security-report.md`;
- `docs/phase-2-plan.md`;
- `docs/kubernetes.md`;
- `infra/terraform/README.md`.

**Beneficio tecnico:** documentacao passa a refletir o estado atual do projeto.

**Impacto para avaliacao FIAP:** facilita verificacao dos requisitos e evidencias da Fase 2.
