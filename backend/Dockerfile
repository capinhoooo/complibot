FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install
COPY package.json ./
RUN bun install --frozen-lockfile || bun install

FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY . .
RUN bunx prisma generate --config prisma/prisma.config.ts

FROM base
COPY --from=build /app ./

ENV NODE_ENV=production
EXPOSE 3001

CMD ["bun", "run", "start"]
