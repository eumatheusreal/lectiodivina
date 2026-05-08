# lectiodivina
Site para ajudar na lectio divina

## Desenvolvimento em `https://localhost`

O ambiente de desenvolvimento usa o `reverse-proxy-dev` com acesso via `localhost` e HTTPS.
O certificado autoassinado é gerado pelo container `dev-cert-init`.

### Arquivos
- `docker-compose.dev.yml`
- `docker/dev-cert-init/Dockerfile`
- `scripts/dev-cert-init.sh`
- `docker/nginx/nginx.dev.conf`

### Subir ambiente de desenvolvimento
```bash
docker compose -f docker-compose.dev.yml up --build
```

### Acessar o frontend em desenvolvimento
Após subir o ambiente com o compose de desenvolvimento, acesse:
- `https://localhost`

> O frontend Next.js roda internamente na porta `3000` e é publicado pelo Nginx no `https://localhost`.

Ao iniciar, o `dev-cert-init` gera:
- `/certs/localhost.crt`
- `/certs/localhost.key`

Esses arquivos ficam persistidos no volume nomeado `certs-dev` e são usados pelo Nginx.

### Variáveis suportadas
- `CERT_DIR` (default: `/certs`)
- `DOMAIN` (default: `localhost`)

Exemplo para outro domínio:
```bash
DOMAIN=lectiodivina.local docker compose up --build dev-cert-init
```

## Produção

### Subir ambiente de produção
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### Acessar o frontend em produção
Com o ambiente de produção ativo, acesse o domínio/host configurado no proxy de produção (arquivo `docker/nginx/nginx.conf`).

## Testes automatizados

### Backend (Jest + Supertest)
```bash
cd backend
npm install
npm test
```

Esse comando executa a suíte de testes automatizados em `backend/test/app.spec.ts`.

## Auditoria de segurança (npm audit)

Para auditar dependências localmente:

### Frontend
```bash
cd frontend
npm audit
```

### Backend
```bash
cd backend
npm audit
```

Resultado esperado após as correções: `found 0 vulnerabilities` em ambos.

### Troubleshooting do erro `exit 127`
Código de saída `127` normalmente significa **comando não encontrado**.

Neste setup, as causas mais comuns são:
- script com `bash` em imagem com apenas `sh`;
- ausência do `openssl`.

A configuração já previne isso com:
- script POSIX (`#!/bin/sh`);
- instalação de `openssl` no Dockerfile;
- validação explícita de `openssl` no script.
