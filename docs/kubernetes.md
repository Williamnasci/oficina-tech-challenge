# Deploy Kubernetes

Os manifestos da Fase 2 ficam em `/k8s` e descrevem um ambiente demonstravel com API, PostgreSQL e autoscaling horizontal.

## Recursos Criados

- Namespace `oficina`.
- ConfigMap `oficina-api-config` com variaveis nao sensiveis.
- Secret `oficina-secrets` com credenciais, `JWT_SECRET` e `DATABASE_URL`.
- StatefulSet e Service do PostgreSQL.
- Deployment da API com 2 replicas.
- Init container para executar `npx prisma migrate deploy`.
- Service `LoadBalancer` para expor a API.
- HPA escalando a API por CPU e memoria.

## Build da Imagem

```bash
docker build -t oficina-tech-challenge:latest .
```

Em clusters locais como Minikube ou Kind, a imagem precisa estar disponivel dentro do cluster.

Minikube:

```bash
minikube image load oficina-tech-challenge:latest
```

Kind:

```bash
kind load docker-image oficina-tech-challenge:latest
```

## Aplicar Manifestos

```bash
kubectl apply -k k8s
```

## Verificar Recursos

```bash
kubectl get pods -n oficina
kubectl get svc -n oficina
kubectl get hpa -n oficina
```

## Acessar Localmente

Com Minikube:

```bash
minikube service oficina-api -n oficina
```

Com port-forward:

```bash
kubectl port-forward svc/oficina-api 3000:80 -n oficina
```

Depois acesse:

- API: `http://localhost:3000`
- Health check: `http://localhost:3000/health`
- Swagger: `http://localhost:3000/docs`

## Observacoes

- Os valores em `k8s/02-secret.yaml` sao exemplos para desenvolvimento e demonstracao.
- Em ambiente real, secrets devem ser injetados por um cofre ou pelo mecanismo seguro do provedor cloud.
- O HPA depende do metrics-server instalado no cluster.
