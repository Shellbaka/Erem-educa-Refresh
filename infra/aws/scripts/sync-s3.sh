#!/usr/bin/env bash
set -euo pipefail

DIST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)/dist"
BUCKET_NAME=${1:-"erem-educa-refresh-frontend"}
REGION=${AWS_REGION:-"us-east-1"}

if [ ! -d "${DIST_DIR}" ]; then
  echo "dist/ not found. Run 'npm run build' before syncing."
  exit 1
fi

aws s3 sync "${DIST_DIR}/" "s3://${BUCKET_NAME}/" \
  --delete \
  --region "${REGION}" \
  --cache-control "public,max-age=31536000,immutable"

echo "S3 bucket ${BUCKET_NAME} updated with latest build."


