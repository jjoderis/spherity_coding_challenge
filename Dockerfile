FROM node:24-alpine AS base

FROM base AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM base AS runner

ENV NODE_ENV=production
ENV WALLET_URL=http://localhost:3000
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

WORKDIR /app

COPY --from=builder --chown=nodejs:nodejs app/dist ./
RUN npm install --omit=dev

USER nodejs

EXPOSE 3000

CMD ["node", "main.js"]
