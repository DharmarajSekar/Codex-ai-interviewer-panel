FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY . .
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -fsS http://localhost:8080/healthz || exit 1
CMD ["sh", "-c", "node server.js"]
