#!/usr/bin/env bash
set -euo pipefail
STAMP=$(date +%F-%H%M%S)
mkdir -p backups
docker exec $(docker ps -qf name=postgres) pg_dump -U interviewer interviewer | gzip > "backups/postgres-$STAMP.sql.gz"
