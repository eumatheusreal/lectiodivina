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

### Troubleshooting do erro `exit 127`
Código de saída `127` normalmente significa **comando não encontrado**.

Neste setup, as causas mais comuns são:
- script com `bash` em imagem com apenas `sh`;
- ausência do `openssl`.

A configuração já previne isso com:
- script POSIX (`#!/bin/sh`);
- instalação de `openssl` no Dockerfile;
- validação explícita de `openssl` no script.
