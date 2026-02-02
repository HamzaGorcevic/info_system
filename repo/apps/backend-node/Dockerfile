# Stage 1: Base image with pnpm
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Stage 2: Install dependencies (monorepo-aware)
FROM base AS deps
WORKDIR /app

# Copy workspace configuration and all package.json files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend-node/package.json ./apps/backend-node/
COPY packages/domain/package.json ./packages/domain/
COPY packages/supabase/package.json ./packages/supabase/
COPY packages/types/package.json ./packages/types/

# Install all dependencies with --shamefully-hoist to flatten dependencies
# This ensures all packages can find their dependencies in node_modules
RUN pnpm install --frozen-lockfile --shamefully-hoist

# Stage 3: Production runtime (no build step needed, use tsx)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source code (TypeScript files)
COPY . .

# Expose the port (Railway will set PORT env var)
EXPOSE 3000

# Start the application with tsx (runs TypeScript directly)
CMD ["npx", "tsx", "apps/backend-node/server.ts"]
