# lectiodivina
Site para ajudar na lectio divina

## Ambiente base para `dev-cert-init`

Este repositório agora inclui uma configuração completa para gerar certificados de desenvolvimento de ponta a ponta com Docker Compose.

### Arquivos
- `docker-compose.yml`
- `docker/dev-cert-init/Dockerfile`
- `scripts/dev-cert-init.sh`

### Subir o serviço
```bash
docker compose up --build dev-cert-init
```

Ao finalizar com sucesso, o container gera:
- `/certs/localhost.crt`
- `/certs/localhost.key`

Esses arquivos ficam persistidos no volume nomeado `dev-certs`.

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
