FROM nginx:1.27-alpine
COPY . /usr/share/nginx/html
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget --spider http://localhost:3000/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
