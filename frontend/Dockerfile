# Stage 1: Build
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config to templates directory
# The default nginx entrypoint will automatically run envsubst on this file
# and output it to /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Default to 8080 for Cloud Run
ENV PORT=8080
EXPOSE 8080

# Use default Nginx CMD (no need to override)
