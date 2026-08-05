FROM node:24-alpine AS base

FROM base AS backend-builder
WORKDIR /app
COPY ./backend .
RUN npm ci && npm run build

FROM base AS frontend-builder
WORKDIR /app
COPY  ./frontend ./frontend
COPY  --from=backend-builder app ./backend
RUN cd frontend && npm ci && npm run build

FROM base AS runner

ENV NODE_ENV=production
ENV WALLET_URL=http://localhost:3000
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

WORKDIR /app

COPY --from=backend-builder --chown=nodejs:nodejs app/dist ./
COPY --from=backend-builder --chown=nodejs:nodejs app/node_modules ./node_modules
COPY --from=frontend-builder --chown=nodejs:nodejs app/frontend/dist ./frontend

USER nodejs

EXPOSE 3000

CMD ["node", "main.js"]
