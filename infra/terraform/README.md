# Terraform — Oficina Mecânica

## Objetivo

Esta pasta contém a fundação Terraform da Fase 2 do Tech Challenge.

O objetivo é demonstrar Infraestrutura como Código para provisionar recursos Kubernetes do projeto Oficina Mecânica, mantendo compatibilidade com a estrutura já existente em `k8s/`.

Nesta primeira entrega, o Terraform provisiona apenas os recursos base necessários para preparar o ambiente:

- Namespace;
- ConfigMap;
- Secret.

Os recursos de aplicação e banco de dados serão adicionados nas próximas etapas.

## Estrutura da pasta

```text
infra/
└── terraform/
    ├── versions.tf
    ├── providers.tf
    ├── variables.tf
    ├── main.tf
    ├── outputs.tf
    ├── terraform.tfvars.example
    └── README.md
```

## Recursos atualmente provisionados

O escopo atual cria:

- `kubernetes_namespace`: namespace Kubernetes gerenciado pelo Terraform;
- `kubernetes_config_map`: variáveis não sensíveis da API;
- `kubernetes_secret`: credenciais e variáveis sensíveis usadas pela aplicação.

Ainda não fazem parte desta fundação:

- PostgreSQL `StatefulSet`;
- volume persistente;
- `Deployment` da API;
- `Service` da API;
- HPA.

Esses recursos serão adicionados de forma incremental para reduzir risco e facilitar validação.

## Pré-requisitos

Antes de executar o Terraform, é necessário ter:

- Terraform instalado localmente;
- cluster Kubernetes ativo, como Docker Desktop Kubernetes, Minikube ou Kind;
- arquivo `kubeconfig` válido;
- contexto Kubernetes apontando para o cluster desejado.

O provider Kubernetes usa, por padrão:

```hcl
kube_config_path = "~/.kube/config"
```

Se necessário, o contexto pode ser ajustado em `terraform.tfvars`.

## Como utilizar

Opcionalmente, crie um arquivo local de variáveis a partir do exemplo:

```bash
cp terraform.tfvars.example terraform.tfvars
```

O arquivo `terraform.tfvars.example` contém valores de demonstração. Não use segredos reais em arquivos versionados.

### terraform init

Inicializa o diretório Terraform e baixa o provider Kubernetes:

```bash
terraform init
```

### terraform validate

Valida a sintaxe e a consistência da configuração:

```bash
terraform validate
```

Também é recomendado validar a formatação:

```bash
terraform fmt -check
```

### terraform plan

Mostra os recursos que serão criados antes de aplicar qualquer alteração:

```bash
terraform plan
```

### terraform apply

Aplica os recursos no cluster Kubernetes configurado:

```bash
terraform apply
```

Revise o plano antes de confirmar a execução.

### terraform destroy

Remove os recursos criados pelo Terraform:

```bash
terraform destroy
```

Use este comando apenas em ambiente local ou de demonstração.

## Integração com Kubernetes

O Terraform utiliza o provider Kubernetes para criar recursos diretamente no cluster configurado no `kubeconfig`.

Por padrão, o namespace criado é:

```hcl
namespace_name = "oficina-terraform"
```

Esse namespace foi escolhido para evitar conflito com os manifests já existentes em `k8s/`, que usam o namespace `oficina`.

Caso seja necessário usar o mesmo namespace dos manifests Kubernetes, sobrescreva:

```hcl
namespace_name = "oficina"
```

Nesse caso, não aplique os manifests de `k8s/` e o Terraform no mesmo namespace ao mesmo tempo, a menos que a sobreposição de recursos seja intencional.

## Relação com os manifests da pasta k8s

A pasta `k8s/` permanece como referência funcional e validada dos manifests Kubernetes da aplicação.

A pasta `infra/terraform/` coexiste com `k8s/` e representa uma segunda forma de provisionamento, usando Infraestrutura como Código com Terraform.

Neste momento:

- `k8s/` continua sendo usado para validação Kubernetes via `kubectl kustomize`;
- `infra/terraform/` provisiona a fundação inicial;
- nenhum manifesto de `k8s/` foi removido ou substituído.

## Próximas etapas

As próximas evoluções previstas para Terraform são:

1. Provisionar PostgreSQL com `StatefulSet`;
2. Configurar persistência de dados;
3. Criar o `Deployment` da API;
4. Criar o `Service` da API;
5. Adicionar HPA;
6. Documentar a execução completa em cluster local;
7. Avaliar integração futura com CI/CD apenas para `terraform fmt` e `terraform validate`.

## Observações

Os valores presentes em `terraform.tfvars.example` são apenas para demonstração local.

Segredos reais não devem ser versionados. Além disso, o arquivo de estado do Terraform pode conter valores sensíveis, portanto deve ser protegido em ambientes reais.

Esta fundação foi criada primeiro para permitir validação incremental antes de provisionar banco, aplicação e autoscaling.
