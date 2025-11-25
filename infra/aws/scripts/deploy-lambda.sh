#!/usr/bin/env bash
set -euo pipefail

LAMBDA_NAME=${1:-"erem-educa-refresh"}
ARTIFACT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../lambda/artifacts/lambda-package.zip"

if [ ! -f "${ARTIFACT_PATH}" ]; then
  echo "Artifact not found at ${ARTIFACT_PATH}. Run zip-lambda.sh first."
  exit 1
fi

aws lambda update-function-code \
  --function-name "${LAMBDA_NAME}" \
  --zip-file "fileb://${ARTIFACT_PATH}"

echo "Lambda ${LAMBDA_NAME} updated successfully."


