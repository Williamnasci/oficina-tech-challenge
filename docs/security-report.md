# Análise de Vulnerabilidades

## Objetivo

Este documento registra a análise de segurança realizada na Fase 2 do Tech Challenge, com foco em dependências, imagem Docker, pipeline de CI/CD, observabilidade e práticas de hardening aplicadas ao backend da Oficina Mecânica.

## Escopo e Premissas Acadêmicas

Este é um projeto acadêmico executado em ambiente controlado e acessado somente pelo autor e pelos avaliadores. As credenciais presentes no Docker Compose, nos manifests Kubernetes e nos exemplos Terraform são exclusivamente demonstrativas e não devem ser reutilizadas em ambientes reais.

O login administrativo simplificado, a exposição local de métricas e os scans não bloqueantes foram adotados para demonstrar os conceitos da fase sem introduzir complexidade operacional incompatível com o escopo. As recomendações de produção deste documento registram as adaptações necessárias para um ambiente público ou corporativo.

## Ferramentas Utilizadas

* Trivy Scanner
* npm audit
* GitHub Actions

## Contexto Atual

A aplicação utiliza Node.js 22 e o Dockerfile atual é baseado em:

```dockerfile
FROM node:22-alpine
```

O build da imagem Docker e os scans Trivy são executados no workflow `.github/workflows/ci-cd.yml`.

## Resultado Geral

Os scans podem registrar vulnerabilidades transitivas relacionadas a dependências indiretas do ecossistema Node.js. Esses achados devem ser reconhecidos e acompanhados, pois podem representar risco dependendo do contexto de exposição da aplicação.

### Resultado da execução local (Junho/2026)

**npm audit --audit-level=high**

* HIGH detectadas: 0
* CRITICAL detectadas: 0

**Trivy filesystem**

* HIGH detectadas: 0
* CRITICAL detectadas: 0

**Vulnerabilidades moderadas remanescentes**

* Dependência transitiva `@hono/node-server`
* Introduzida pelo ecossistema Prisma
* Correção exigiria downgrade ou alteração incompatível da versão do Prisma
* Risco aceito para o contexto acadêmico do Tech Challenge

### Detalhamento da validação

* `npm audit --audit-level=high` não encontrou vulnerabilidades HIGH ou CRITICAL.
* `npm install` reportou 3 vulnerabilidades moderadas ligadas à dependência transitiva do Prisma (`@hono/node-server` via `@prisma/dev`).
* A correção automática sugerida exige `npm audit fix --force` e instalaria uma versão incompatível do Prisma em relação à utilizada pelo projeto.
* `trivy fs --scanners vuln --severity HIGH,CRITICAL --timeout 15m --no-progress /project` retornou 0 vulnerabilidades HIGH ou CRITICAL.

Por esse motivo, não foi aplicado downgrade nem correção forçada sem validação específica.

## Mitigações Implementadas

* Dockerfile baseado na imagem oficial `node:22-alpine`.
* Execução da aplicação como usuário não root (`USER node`).
* Exposição apenas das portas necessárias nos containers.
* JWT obrigatório via variável de ambiente.
* Helmet aplicado na aplicação.
* Validação de entrada com `ValidationPipe`.
* Endpoint `/metrics` sem exposição de dados sensíveis, disponibilizando apenas métricas técnicas agregadas.
* Separação arquitetural entre domínio, aplicação, interfaces e infraestrutura.
* Scan Trivy automatizado no GitHub Actions para imagem Docker e filesystem.
* Health checks para API e banco de dados.
* Monitoramento via Prometheus e Grafana para métricas operacionais da aplicação.

## GitHub Actions

O workflow de CI/CD executa:

* Build da aplicação.
* Testes automatizados.
* Docker build.
* Docker push apenas na branch `main` e fora de Pull Requests.
* Scan Trivy da imagem Docker.
* Scan Trivy do filesystem.
* Renderização dos manifests Kubernetes com Kustomize, como verificação sintática básica.

O Trivy está configurado com `exit-code: '0'`. Portanto, os scans têm finalidade informativa e educacional: registram os achados no log, mas não atuam como gate de publicação ou deploy nesta fase acadêmica.

## Recomendações para Produção

Antes de utilização em ambiente produtivo, recomenda-se executar nova auditoria de dependências:

```bash
npm audit
```

Também é recomendado reexecutar os scans locais:

```bash
npm run scan:vuln
npm run scan:image
```

Para validação direta do filesystem com Trivy:

```bash
trivy fs .
```

Adicionalmente, recomenda-se:

* Revisão periódica das dependências e atualização controlada de versões.
* Acompanhamento dos avisos de segurança do ecossistema Node.js e Prisma.
* Revisão periódica dos relatórios Trivy.
* Definição de política formal para tratamento de vulnerabilidades.
* Integração futura com ferramentas de gestão de segredos para ambientes produtivos.

## Conclusão

A postura de segurança implementada está adequada ao contexto acadêmico do Tech Challenge e alinhada aos objetivos da Fase 2.

As validações executadas demonstraram:

* Nenhuma vulnerabilidade HIGH ou CRITICAL foi detectada pelos comandos, parâmetros e bases de vulnerabilidades utilizados na execução local de junho de 2026.
* Pipeline automatizada com verificação de segurança.
* Hardening básico da aplicação e dos containers.
* Monitoramento operacional da aplicação através de Prometheus e Grafana.
* Processo de validação contínua suportado por testes automatizados e análise de vulnerabilidades.

As vulnerabilidades moderadas remanescentes são transitivas e conhecidas. Considerando o ambiente acadêmico controlado e a incompatibilidade indicada pela correção automática, elas foram registradas como risco aceito para esta entrega e permanecem como item de acompanhamento. Essa aceitação não deve ser transportada automaticamente para um ambiente produtivo.
