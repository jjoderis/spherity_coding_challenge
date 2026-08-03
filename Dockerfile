FROM node:24 AS base
WORKDIR /usr/local/app

FROM base AS backend-dev
CMD npm install && npm run start:dev

FROM base AS frontend-dev
CMD npm install && npm run dev
