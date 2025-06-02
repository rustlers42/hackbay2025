FROM oven/bun:1.2.5-slim AS base
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
# Install dependencies based on the preferred package manager
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile 
# --production currently issues with this flag

# Rebuild the source code only when needed
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM base AS release
# Set hostname to localhost
ENV HOSTNAME "0.0.0.0"
RUN adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:bun /app/.next/standalone ./
COPY --from=builder --chown=nextjs:bun /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:bun /app/public ./public
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "server.js" ]