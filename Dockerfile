FROM node:22-alpine AS builder

WORKDIR /usr/src/app

ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/oficina_db?schema=public"

COPY package*.json ./
COPY prisma ./prisma/

RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm ci --no-audit --no-fund

COPY . .

RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/oficina_db?schema=public" npx prisma generate
RUN npm run build

FROM node:22-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm ci --omit=dev --no-audit --no-fund
COPY --from=builder /usr/src/app/dist ./dist
COPY public ./public

RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/oficina_db?schema=public" npx prisma generate

USER node

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
