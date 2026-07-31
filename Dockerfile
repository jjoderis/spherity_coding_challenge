FROM node:24 AS base
WORKDIR /usr/local/app

FROM base AS backend-dev
COPY backend .
RUN npm install
CMD ["npm", "run", "start:dev"]

FROM base AS frontend-dev
COPY frontend .
RUN npm install
CMD ["npm", "run", "dev"]
