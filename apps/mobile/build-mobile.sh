#!/bin/bash
set -e

cd ../frontend

# Hide API routes (they don't work with static export)
if [ -d "app/api" ]; then
  mv app/api app/_api_hidden
fi

# Swap configs
mv next.config.ts next.config.web.ts.bak
cp next.config.mobile.ts next.config.ts

# Build
yarn build
BUILD_STATUS=$?

# Restore everything
mv next.config.ts next.config.mobile.ts.bak || true
mv next.config.web.ts.bak next.config.ts

if [ -d "app/_api_hidden" ]; then
  mv app/_api_hidden app/api
fi

exit $BUILD_STATUS
