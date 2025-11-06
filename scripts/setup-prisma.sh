#!/usr/bin/env bash
set -e

echo "Checking Prisma migrations..."

if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
  echo "Migrations found — running prisma migrate deploy"
  npx prisma migrate deploy
else
  echo "No migrations found — running prisma db push"
  npx prisma db push --accept-data-loss
fi

echo "Prisma setup complete"
