# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files (npm project)
COPY package.json package-lock.json ./

# Install dependencies using lockfile
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build application
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy build output from builder stage
COPY --from=builder /app/build .

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
