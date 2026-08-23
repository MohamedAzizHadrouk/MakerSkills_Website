# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3020
ENV UPLOADS_DIR=/app/uploads

RUN apk add --no-cache wget \
  && addgroup -S app && adduser -S app -G app

COPY package.json package-lock.json ./
# bcrypt may need native rebuild on Alpine
RUN apk add --no-cache --virtual .build-deps python3 make g++ \
  && npm ci --omit=dev \
  && apk del .build-deps \
  && npm cache clean --force

COPY --from=build /app/dist ./dist

RUN mkdir -p /app/uploads && chown -R app:app /app

USER app

EXPOSE 3020

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3020/health >/dev/null || exit 1

CMD ["node", "dist/main.js"]
