#!/bin/bash

echo "Building client..."
cd client
npm install
npm run build

echo "Building API..."
cd ../api
npm install
npm run build

echo "Starting server..."
npm run start:prod
