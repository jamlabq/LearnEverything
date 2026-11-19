#!/usr/bin/env bash
set -euo pipefail
TASK_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$TASK_ROOT"
if [[ ! -f assets/fpga-labs.zip ]]; then
  python3 scripts/export_waves.py --package-only
fi
echo "在浏览器打开 http://localhost:${1:-8000}"
exec python3 -m http.server "${1:-8000}" --bind 127.0.0.1
