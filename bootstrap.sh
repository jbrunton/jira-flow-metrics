#!/bin/bash

echo "Building apps..."
pnpm install
pnpm build

echo "Starting server..."
cd apps/api
pnpm start:prod
