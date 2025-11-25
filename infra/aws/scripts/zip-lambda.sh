#!/usr/bin/env bash
set -euo pipefail

LAMBDA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/lambda"
ARTIFACTS_DIR="${LAMBDA_DIR}/artifacts"
ZIP_NAME="lambda-package.zip"

mkdir -p "${ARTIFACTS_DIR}"
rm -f "${ARTIFACTS_DIR}/${ZIP_NAME}"

pushd "${LAMBDA_DIR}" >/dev/null
  zip -r "${ARTIFACTS_DIR}/${ZIP_NAME}" handlers services package.json package-lock.json
popd >/dev/null

echo "Lambda bundle created at ${ARTIFACTS_DIR}/${ZIP_NAME}"


