## Deploy AWS – Erem Educa Refresh

### Pré-requisitos

- Node.js 18+
- Supabase CLI (`npm install -g supabase` ou `npx supabase --help`)
- AWS CLI configurado (`aws configure`)
- Conta AWS com permissões para Lambda, S3, API Gateway e IAM

---

### 1. Build do front-end e upload para S3

```bash
npm install
npm run build
bash infra/aws/scripts/sync-s3.sh <nome-do-bucket>
```

O script usa `aws s3 sync` para enviar o conteúdo da pasta `dist/` (gerada pelo Vite) para o bucket público que servirá o site estático.

---

### 2. Empacotar e fazer deploy da Lambda

```bash
# dentro de infra/aws/scripts
bash zip-lambda.sh
bash deploy-lambda.sh <nome-da-lambda>
```

`zip-lambda.sh` cria `infra/aws/lambda/artifacts/lambda-package.zip` contendo handlers, serviços e dependências.  
`deploy-lambda.sh` usa `aws lambda update-function-code` para substituir o código da função.

Para deploy manual:

1. `npm install --production` dentro de `infra/aws/lambda`.
2. `zip -r lambda.zip .`
3. `aws lambda update-function-code --function-name <nome> --zip-file fileb://lambda.zip`

---

### 3. Configurar variáveis de ambiente

Use `aws lambda update-function-configuration` ou o console da AWS para definir:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `S3_BUCKET`
- `AWS_REGION`

Arquivo de apoio: `aws-env.json`.

---

### 4. API Gateway REST

1. Crie uma API REST.
2. Rotas:
   - `GET /health` → `healthCheckHandler`
   - `GET /dados` → `getDataHandler`
   - `POST /registro` → `saveToS3Handler`
3. Configure integração Lambda Proxy e habilite CORS.
4. Crie um Stage (`prod`) e copie a URL para configurar `VITE_API_URL`.

---

### 5. IAM – políticas mínimas

**Lambda role** deve ter:

```json
{
  "Effect": "Allow",
  "Action": [
    "s3:PutObject",
    "s3:PutObjectAcl"
  ],
  "Resource": "arn:aws:s3:::<bucket>/*"
}
```

Como a Lambda acessa Supabase via internet pública, garanta permissão de saída (NAT ou VPC default). Nenhuma policy extra é necessária além de acesso à internet.

---

### 6. Testes locais

- Utilize o [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/) ou `supabase db remote commit` para simular as Lambdas.
- Para testar rapidamente:
  ```bash
  node --experimental-vm-modules infra/aws/lambda/handlers/healthCheckHandler.js
  ```

---

### 7. Próximos passos recomendados

- Automatizar deploy completo via GitHub Actions ou AWS CodePipeline.
- Criar CloudFront em frente ao bucket S3 para HTTPS e cache.
- Configurar monitoramento (CloudWatch Logs, X-Ray) e alarms para Lambda.
- Revisar políticas RLS no Supabase e secrets na AWS (SSM Parameter Store / Secrets Manager).


