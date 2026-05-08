# Lectio Divina Web (Secure-First Starter)

Projeto inicial full-stack com **Next.js + NestJS + Prisma + MySQL + Docker + Nginx + Certbot**, focado em privacidade, isolamento por usuário e preparação para AWS EC2 com migração futura para RDS sem alterar código.

## Status atual

Este repositório contém uma **base estrutural segura** (scaffold) com:
- organização de pastas frontend/backend/docker;
- schema Prisma para `User`, `Lectio`, `Tag`, `LectioTag`, `RefreshToken`;
- endpoints REST mínimos definidos;
- compose de desenvolvimento e produção;
- Nginx reverse proxy com ACME challenge;
- `.env.example` com variáveis obrigatórias.

> Próximo passo: implementar serviços reais de autenticação JWT/refresh rotation, guards, persistência Prisma, testes completos e UI completa.

## Estrutura
- `frontend/`
- `backend/`
- `docker/`
- `docker-compose.dev.yml`
- `docker-compose.prod.yml`
- `.env.example`

## Segurança (decisões principais)
- Backend como única camada de regra de negócio.
- Sem exposição pública de MySQL em produção.
- Token de acesso curto + refresh token HttpOnly (a implementar no serviço Auth).
- Hash de senha (bcrypt/argon2) e nunca retornar `passwordHash`.
- CORS restritivo (`CORS_ORIGIN`).
- Headers de segurança no Nginx e Helmet no backend.
- Prisma + queries parametrizadas (evita SQL injection clássico).
- Filtragem por `userId` em todo CRUD de Lectio/Tag (a reforçar nos services e testes).

## Desenvolvimento
```bash
cp .env.example .env
docker compose -f docker-compose.dev.yml up -d
```
- Acesso único via proxy HTTPS local: `https://localhost`
- API via proxy: `https://localhost/api`
- Observação: certificado local autoassinado (aceite o aviso do navegador no primeiro acesso).

## Produção/Teste (EC2)
```bash
docker compose -f docker-compose.prod.yml up -d --build
```
Somente Nginx deve ficar público (80/443).

### Emissão inicial de certificado
```bash
docker compose -f docker-compose.prod.yml run --rm certbot-init
```
### Renovação (teste)
```bash
docker compose -f docker-compose.prod.yml run --rm certbot-renew --dry-run
```

## Migração futura para RDS MySQL
1. Criar RDS na mesma VPC (preferência privado).
2. Liberar SG do RDS apenas para SG/EC2 da aplicação.
3. Atualizar `DATABASE_URL` para endpoint RDS.
4. Rodar `prisma migrate deploy`.
5. Exportar/importar dados:
```bash
# export
docker exec -i <mysql_container> mysqldump -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE > backup.sql
# import para RDS
mysql -h <rds-endpoint> -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < backup.sql
```

## Backups
- Fazer dump antes de migrations destrutivas.
- Guardar backup fora do host/volume Docker.
- Testar restauração periodicamente.

## Controle de custos AWS
- Configurar AWS Budget com alerta por e-mail.
- Recursos com custo: EC2, EBS, snapshots, Elastic IP parado/desanexado.
- Ao encerrar teste: `docker compose down`, parar instância e remover recursos não usados.


## Versão do Node.js
- Projeto fixado em **Node.js 22.15.1 (LTS)** nas imagens Docker de desenvolvimento e produção.
