# Stage 1: Build
FROM node:22-alpine as builder
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine
WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Add this line to copy the wait-for.sh script into the runtime image
COPY wait-for.sh ./wait-for.sh

# Make sure it's executable
RUN chmod +x wait-for.sh

# Set a non-root user for security
USER node

EXPOSE 4000

# Use wait-for.sh to wait for db before starting the app
CMD ["./wait-for.sh", "db", "3306", "--", "node", "dist/server.js"]
