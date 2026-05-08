#!/bin/sh
set -eu

CERT_DIR="${CERT_DIR:-/certs}"
DOMAIN="${DOMAIN:-localhost}"

mkdir -p "$CERT_DIR"

if ! command -v openssl >/dev/null 2>&1; then
  echo "Erro: openssl não encontrado no container dev-cert-init." >&2
  echo "Instale openssl na imagem (ex.: apk add --no-cache openssl)." >&2
  exit 127
fi

openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout "$CERT_DIR/$DOMAIN.key" \
  -out "$CERT_DIR/$DOMAIN.crt" \
  -days 825 \
  -subj "/CN=$DOMAIN"

echo "Certificados gerados em $CERT_DIR"
