FROM alpine:3.20

RUN apk add --no-cache openssl

WORKDIR /app

COPY scripts/dev-cert-init.sh /app/scripts/dev-cert-init.sh
RUN chmod +x /app/scripts/dev-cert-init.sh

ENTRYPOINT ["/app/scripts/dev-cert-init.sh"]
