# ---- Builder Stage ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./
COPY packages/core ./packages/core
COPY packages/cli ./packages/cli

RUN npm install
RUN npm run cli:build

# ---- Runner Stage ----
FROM node:22-slim AS runner

WORKDIR /app/packages/cli

COPY --from=builder /app/packages/cli/out ./out
COPY --from=builder /app/packages/cli/package.json ./package.json
COPY --from=builder /app/packages/core/out ../core/out
COPY --from=builder /app/packages/core/package.json ../core/package.json
COPY --from=builder /app/package.json /app/package.json

RUN npm install --omit=dev

# Create the config directory
RUN mkdir -p /app/config

EXPOSE 80

# Expect config to be mounted at /app/config/proxy-mocksy.config.json
CMD ["npm", "start", "--", "--config", "/app/config/proxy-mocksy.config.json", "--port", "80"]