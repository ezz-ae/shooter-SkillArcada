#!/usr/bin/env bash
set -euo pipefail

# Usage: scripts/make-zip.sh [version]
# Example: scripts/make-zip.sh v1.0.0
VERSION="${1:-$(git describe --tags --abbrev=0 2>/dev/null || echo "v$(date +%Y.%m.%d)")}"
OUTDIR="release"
ZIP="shooter-${VERSION}.zip"

echo "==> Creating ${OUTDIR}/${ZIP}"
mkdir -p "${OUTDIR}"

# Optional: build Functions ahead of time so buyers get lib/
if [ -d "functions" ] && [ -f "functions/package.json" ]; then
  echo "==> Building functions/"
  (cd functions && npm ci >/dev/null 2>&1 || npm i && npm run build)
fi

# Archive current HEAD (respects .gitattributes export-ignore if present)
git archive --format=zip --output "${OUTDIR}/${ZIP}" HEAD

echo "==> Done: ${OUTDIR}/${ZIP}"
