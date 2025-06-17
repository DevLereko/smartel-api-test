# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine
WORKDIR /app

# Install netcat (required for wait-for.sh)
RUN apk add --no-cache netcat-openbsd

# Copy only production files
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

# Copy wait-for.sh and set permissions
COPY wait-for.sh /app/wait-for.sh
RUN chmod +x /app/wait-for.sh

# Optional: copy certs in case Docker Compose volumes aren't used
COPY certs /app/certs

# Use non-root user
USER node

CMD ["/app/wait-for.sh", "db", "3306", "--", "node", "dist/server.js"]