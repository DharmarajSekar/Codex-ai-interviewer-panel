# Production Deployment and Enterprise Infrastructure

## Architecture
- Docker-first microservices with API, realtime, inference (GPU), worker, frontend.
- Nginx reverse proxy in front of Kong API gateway.
- Kubernetes manifests with HPA and GPU node scheduling.
- Observability stack: Prometheus + Grafana + Loki + OpenTelemetry.

## Security Hardening
- JWT validation at gateway; enforce exp and nbf claims.
- Strict CORS/WS allowlists through gateway and env configuration.
- Nginx rate limiting at edge + Kong plugin throttling.
- Runtime secrets injected by Kubernetes Secret / environment files (never commit real secrets).

## Deployment Targets
- Local: `docker compose up -d --build`
- VPS: `kubectl apply -k k8s/overlays/vps`
- GPU: `kubectl apply -k k8s/overlays/gpu`
- Cloud: `kubectl apply -k k8s/overlays/cloud`

## Autoscaling
- API HPA scales 3..20 by CPU and memory.
- GPU inference deployment scales independently with nodeSelector and GPU limits.

## Backup and Recovery
- Scheduled DB backups with `scripts/backup.sh`.
- Store backups in offsite object storage with lifecycle policy.
- Quarterly restore drill required.

## Secrets Management
- Use external secret providers (Vault/AWS Secrets Manager/GCP Secret Manager) synced to Kubernetes Secrets.
- Rotate JWT signing keys and DB passwords every 90 days.

## Health Checks
- Every service includes Docker health checks.
- Kubernetes readiness/liveness probes configured for core services.

## CI/CD
- GitHub Actions validates compose + kustomize, builds containers, pushes to GHCR, and triggers GitOps deploy.
