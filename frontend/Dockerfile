# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json ./
COPY package-lock.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm ci --legacy-peer-deps
RUN pnpm install

# Copy source code
COPY . .

# Build application
ENV NODE_ENV=production
RUN npm run build
RUN pnpm run build

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