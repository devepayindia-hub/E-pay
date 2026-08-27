#!/bin/bash

# ePay CRM Docker Build Script
# Usage: ./docker-build.sh [environment]
# environments: development, staging, production

set -e

ENVIRONMENT=${1:-development}
PROJECT_ID="epaycrm-63608"

echo "============================================"
echo "ePay CRM Docker Build - $ENVIRONMENT"
echo "============================================"
echo ""

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    echo "Error: Invalid environment. Use: development, staging, or production"
    exit 1
fi

# Build the Docker image
echo "Building Docker image..."
docker build \
    --build-arg NODE_ENV="$ENVIRONMENT" \
    --build-arg FIREBASE_PROJECT_ID="$PROJECT_ID" \
    -t "epay-crm:$ENVIRONMENT" \
    -t "epay-crm:latest" \
    .

echo ""
echo "✓ Docker build completed successfully"
echo ""
echo "Next steps:"
echo "  1. Run with: docker-compose up -d"
echo "  2. Or run directly: docker run -p 8080:8080 epay-crm:$ENVIRONMENT"
echo ""