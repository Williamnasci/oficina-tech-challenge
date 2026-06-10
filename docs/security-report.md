# Análise de Vulnerabilidades

## Objetivo

Este documento registra a análise de segurança realizada na Fase 2 do Tech Challenge, com foco em dependências, imagem Docker, pipeline de CI/CD e práticas de hardening aplicadas ao backend da Oficina Mecânica.

## Ferramentas Utilizadas

- Trivy Scanner.
- npm audit.
- GitHub Actions.

## Contexto Atual

A aplicação utiliza Node.js 22 e o Dockerfile atual é baseado em:

```dockerfile
FROM node:22-alpine
```

O build da imagem Docker e os scans Trivy são executados no workflow `.github/workflows/ci-cd.yml`.

## Resultado Geral

Os scans registram vulnerabilidades transitivas relacionadas a dependências indiretas do ecossistema Node.js. Esses achados devem ser reconhecidos e acompanhados, pois podem representar risco dependendo do contexto de exposição da aplicação.

Como os números de severidade podem mudar conforme atualização de base do scanner, lockfile, imagem base e dependências transitivas, este relatório não fixa uma contagem como evidência definitiva. A correção deve ser avaliada de forma controlada para evitar atualizações incompatíveis com a stack atual.

## Mitigações Implementadas

- Dockerfile baseado na imagem oficial `node:22-alpine`.
- Execução da aplicação como usuário não root (`USER node`).
- Exposição apenas da porta necessária da API.
- JWT obrigatório via variável de ambiente.
- Helmet aplicado na aplicação.
- Validação de entrada com `ValidationPipe`.
- Separação arquitetural entre domínio, aplicação, interfaces e infraestrutura.
- Scan Trivy automatizado no GitHub Actions para imagem Docker e filesystem.

## GitHub Actions

O workflow de CI/CD executa:

- build e testes;
- Docker build;
- Docker push apenas na branch `main` e fora de Pull Requests;
- scan Trivy da imagem Docker;
- scan Trivy do filesystem;
- validação dos manifests Kubernetes.

O Trivy está configurado com `exit-code: '0'`, registrando os achados no log da pipeline sem bloquear a entrega acadêmica por vulnerabilidades transitivas conhecidas.

## Recomendações para Produção

Antes de uso produtivo, recomenda-se executar nova auditoria de dependências:

```bash
npm audit
```

Também é recomendado reexecutar os scans locais:

```bash
npm run scan:vuln
npm run scan:image
```

Em um ambiente produtivo, os achados devem ser tratados conforme política de risco, criticidade, exposição da aplicação e disponibilidade de versões compatíveis. Atualizações de dependências devem ser feitas de forma controlada, com validação de build, testes automatizados, Docker build e pipeline após qualquer alteração.

## Conclusão

A postura de segurança está adequada ao contexto acadêmico do Tech Challenge. Existem vulnerabilidades transitivas conhecidas, mas a aplicação possui controles de hardening, isolamento arquitetural e scan automatizado no pipeline.

Para produção, a recomendação é revalidar as dependências, atualizar pacotes compatíveis e tratar vulnerabilidades de acordo com uma política formal de segurança.
