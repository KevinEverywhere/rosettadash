# Production-style image: built Angular UI (nginx) + NestJS API
FROM node:22-bookworm-slim AS build

RUN npm install -g npm@11.17.0

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx nx run-many -t build -p core,client,server --configuration=production

FROM node:22-bookworm-slim AS runtime

RUN apt-get update \
  && apt-get install -y --no-install-recommends nginx \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app/server

COPY --from=build /app/dist/apps/server/package.json /app/dist/apps/server/package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist/apps/server/main.js ./main.js
COPY --from=build /app/dist/apps/client/browser /usr/share/nginx/html
COPY docker/nginx.prod.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.prod.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENV PORT=3000
ENV HOST=127.0.0.1
ENV NODE_ENV=production

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8080/api/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/entrypoint.sh"]
