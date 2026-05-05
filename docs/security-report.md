## 🔒 Análise de Vulnerabilidades

### Ferramenta utilizada

Trivy Scanner / npm audit

### Data da análise

08/04/2026

### Resultado Geral

* CRITICAL: 0
* HIGH: 2
* MEDIUM: 3
* LOW: 0
* Total: 5

### Principais vulnerabilidades identificadas

**1. Dependência:** `lodash`
* **Versão instalada:** `4.17.23`
* **Severidade:** HIGH/MEDIUM
* **Solução sugerida:** Atualizar para a versão corrigida indicada pelo scanner quando disponível no ecossistema de dependências.

**2. Dependência:** `path-to-regexp`
* **Versão instalada:** `8.3.0`
* **Severidade:** HIGH/MEDIUM
* **Solução sugerida:** Atualizar para `8.4.0` ou superior.

**3. Dependência:** `@hono/node-server`
* **Versão instalada:** `1.19.11`
* **Severidade:** MEDIUM
* **Solução sugerida:** Atualizar para `1.19.13` ou superior.

### Ações Recomendadas

* **Atualização de Dependências:** Recomenda-se executar `npm audit fix` e nova varredura Trivy antes de produção.
* **Mitigação:** O Dockerfile expõe apenas as portas necessárias e usa imagem oficial e leve (`node:20-alpine`). 
* **Remoção de Libs Não Utilizadas:** Nenhuma biblioteca supérflua no pacote final do backend. Dependências de tipagem estão restritas localmente como `devDependencies`.
* **Observação:** As vulnerabilidades identificadas são transitivas, provenientes de dependências do ecossistema Node.js; não foram identificadas vulnerabilidades diretamente na lógica de domínio da aplicação.
