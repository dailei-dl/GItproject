FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.base.json ./
COPY apps/api apps/api
COPY packages/shared packages/shared
EXPOSE 3000
CMD ["node", "--import", "tsx", "apps/api/src/main.ts"]
