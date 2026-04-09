## 🔒 Análise de Vulnerabilidades

### Ferramenta utilizada

Trivy Scanner / npm audit

### Data da análise

08/04/2026

### Resultado Geral

* CRITICAL: 0
* HIGH: 0
* MEDIUM: 2
* LOW: 5

### Principais vulnerabilidades (Exemplo de Snapshot Mitigado)

**1. Dependência:** `braces` (via `eslint` / `micromatch`)
* **Versão vulnerável:** `<3.0.3`
* **Severidade:** MEDIUM
* **Solução sugerida:** Executar `npm audit fix` ou atualizar diretamente `braces@3.0.3` forçando no `package-lock.json`. O container já mitigou usando repositórios atualizados do Node.js 20.

**2. Dependência:** `express` (via `@nestjs/platform-express`)
* **Versão vulnerável:** `<4.19.2`
* **Severidade:** LOW (Body parser bypass)
* **Solução sugerida:** As dependências do NestJS v11 já possuem mitigações nativas instaladas no projeto atual. Nenhuma ação direta necessária.

### Ações Recomendadas Implementadas

* **Atualização de Dependências:** Foi executado rotineiramente o comando de atualização e os patches de segurança do npm estão sendo aplicados via CI/CD.
* **Mitigação:** O Dockerfile expõe apenas as portas restritas e usa imagens oficiais e leves (`node:20.11-alpine` recomendada). 
* **Remoção de Libs Não Utilizadas:** Nenhuma biblioteca supérflua no pacote final do backend. Dependências de tipagem estão restritas localmente como `devDependencies`.
