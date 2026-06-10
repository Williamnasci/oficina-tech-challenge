# Observabilidade

## Objetivo

Este documento descreve a solução mínima viável de observabilidade implementada para a Fase 2 do Tech Challenge FIAP, cobrindo métricas da API, Prometheus, Grafana e próximos passos para logs e traces distribuídos.

## Arquitetura

```text
NestJS API
  -> /health
  -> /metrics
       |
       v
Prometheus
       |
       v
Grafana
```

A API expõe métricas em formato Prometheus no endpoint `/metrics`. O Prometheus coleta essas métricas pelo Docker Compose e o Grafana é provisionado com datasource e dashboard inicial.

## Métricas da API

| Métrica | Tipo | Descrição |
|---------|------|-----------|
| `requests_total` | Counter | Total de requisições HTTP por método, rota e status |
| `request_duration_seconds` | Histogram | Duração das requisições HTTP por método, rota e status |
| `healthcheck_status` | Gauge | Status do health check por componente; `1` para OK e `0` para erro |

Também são coletadas métricas padrão do runtime Node.js com prefixo `oficina_`, como uso de memória, CPU, event loop e garbage collector.

## Endpoint /metrics

Executando a API, valide:

```bash
curl http://localhost:3000/metrics
```

Exemplos de séries esperadas:

```text
requests_total{method="GET",route="/health",status_code="200"} 1
request_duration_seconds_bucket{method="GET",route="/health",status_code="200",le="0.05"} 1
healthcheck_status{component="app"} 1
healthcheck_status{component="database"} 1
```

## Docker Compose

Suba o ambiente completo:

```bash
docker compose up -d --build
```

Serviços:

| Serviço | URL | Observação |
|---------|-----|------------|
| API | `http://localhost:3000` | Aplicação NestJS |
| Métricas | `http://localhost:3000/metrics` | Endpoint Prometheus |
| Prometheus | `http://localhost:9090` | Coleta métricas da API |
| Grafana | `http://localhost:3001` | Login `admin` / `admin` |

## Prometheus

Configuração:

```text
monitoring/prometheus/prometheus.yml
```

O job `oficina-api` coleta:

```yaml
metrics_path: /metrics
targets:
  - api:3000
```

## Grafana

Arquivos provisionados:

```text
monitoring/grafana/provisioning/datasources/prometheus.yml
monitoring/grafana/provisioning/dashboards/oficina.yml
monitoring/grafana/dashboards/oficina-api.json
```

O dashboard `Oficina API` exibe:

- requisições por segundo;
- latência HTTP p50 e p95;
- status do health check por componente.

## Kubernetes e Terraform

Os pods da API recebem anotações de scrape:

```yaml
prometheus.io/scrape: "true"
prometheus.io/path: /metrics
prometheus.io/port: "3000"
```

Essas anotações estão presentes nos manifests Kubernetes e no Deployment gerado via Terraform. Um Prometheus instalado no cluster pode descobrir ou configurar scrape para os pods da API.

## OpenTelemetry

OpenTelemetry foi avaliado, mas não foi implementado nesta etapa para evitar aumento relevante de dependências, configuração e superfície de mudança. A implementação atual já cobre o requisito mínimo de métricas e dashboard.

Evolução recomendada:

- adicionar SDK OpenTelemetry para Node.js;
- instrumentar HTTP/NestJS e Prisma;
- exportar traces por OTLP;
- enviar traces para Jaeger ou Grafana Tempo.

## Loki e Jaeger

Loki e Jaeger também foram avaliados como evolução futura:

- Loki: centralização de logs estruturados dos containers e pods;
- Jaeger: visualização de traces distribuídos;
- OpenTelemetry Collector: camada comum para receber, processar e exportar métricas, logs e traces.

Para o escopo atual, a decisão técnica foi manter Prometheus e Grafana implementados e documentar logs/traces como arquitetura futura.
