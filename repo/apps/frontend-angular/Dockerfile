# Stage 1: Base image with pnpm
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Stage 2: Install dependencies (monorepo-aware)
FROM base AS deps
WORKDIR /app

# Copy workspace configuration and all package.json files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/frontend-angular/package.json ./apps/frontend-angular/
COPY packages/domain/package.json ./packages/domain/
COPY packages/supabase/package.json ./packages/supabase/

# Install all dependencies with --shamefully-hoist to flatten dependencies
RUN pnpm install --frozen-lockfile --shamefully-hoist

# Stage 3: Build the Angular application
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source code
COPY . .

# Build the Angular app for production
WORKDIR /app/apps/frontend-angular
RUN ../../node_modules/.bin/ng build --configuration production

# Stage 4: Production runtime with nginx
FROM nginx:alpine AS runner

# Install gettext for envsubst
RUN apk add --no-cache gettext


# Copy built Angular app from builder
COPY --from=builder /app/apps/frontend-angular/dist/frontend-angular/browser /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
