#!/usr/bin/env bash
set -e
set -o pipefail

(
  cd ./dist/granulajs/platform-browser-granula
  npm publish --access public
)

echo 'DONE'
