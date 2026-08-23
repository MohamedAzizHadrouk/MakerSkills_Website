# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN test -f dist/main.js || (echo "Expected dist/main.js; got:" && find dist -name 'main.js' && exit 1)

# ---- runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3020
ENV UPLOADS_DIR=/app/uploads

RUN apk add --no-cache wget su-exec \
  && addgroup -S app && adduser -S app -G app

COPY package.json package-lock.json ./
# bcrypt may need native rebuild on Alpine
RUN apk add --no-cache --virtual .build-deps python3 make g++ \
  && npm ci --omit=dev \
  && apk del .build-deps \
  && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
  && mkdir -p /app/uploads \
  && chown -R app:app /app

# Entrypoint runs as root briefly (env check + chown uploads), then su-exec to app
USER root

EXPOSE 3020

HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=10 \
  CMD wget -qO- http://127.0.0.1:3020/health >/dev/null || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
