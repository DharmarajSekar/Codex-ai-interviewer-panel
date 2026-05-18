#!/usr/bin/env bash
set -euo pipefail
TARGET=${1:-local}
if [[ "$TARGET" == "local" ]]; then
  docker compose up -d --build
else
  kubectl apply -k "k8s/overlays/$TARGET"
fi
