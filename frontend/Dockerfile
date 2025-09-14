# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm (optional, in case you want to use it)
RUN npm install -g pnpm

# Copy package files
COPY package*.json ./
# Copy pnpm lockfile only if it exists (won't fail if missing)
COPY pnpm-lock.yaml* ./

# Install dependencies
# If pnpm-lock.yaml exists → use pnpm, else fallback to npm
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else npm ci --legacy-peer-deps; fi

# Copy source code
COPY . .

# Build application
ENV NODE_ENV=production
RUN if [ -f pnpm-lock.yaml ]; then pnpm run build; else npm run build; fi

# Production stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy build output from builder stage
COPY --from=builder /app/build .

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add security headers and other configurations
RUN echo "server_tokens off;" >> /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
