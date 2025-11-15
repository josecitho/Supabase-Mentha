#!/bin/bash
echo "Installing dependencies..."
npm install

echo "Building Prisma..."
npx prisma generate

echo "Build complete!"
