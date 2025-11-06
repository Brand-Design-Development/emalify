#!/usr/bin/env bash

set -e

# Sample leads data for testing the Emalify Lead Management System
source .env

# Use environment variable or default to localhost:3000
EMALIFY_HOME_URL=${EMALIFY_HOME_URL:-http://localhost:3000}
# Get API key from environment or prompt for it
EMALIFY_LMS_API_KEY=${EMALIFY_LMS_API_KEY:-}

if [ -z "$EMALIFY_LMS_API_KEY" ]; then
  echo "Error: EMALIFY_LMS_API_KEY environment variable is not set"
  echo "Please set it with: export EMALIFY_LMS_API_KEY=your-api-key"
  exit 1
fi

echo "Adding sample lead to the database..."
echo "Using URL: $EMALIFY_HOME_URL"
echo ""

# Lead 1 - High Budget - Form Submitted (Nov 5)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Sarah Johnson",
    "email": "sarah.johnson@techcorp.com",
    "phone_number": "2125551234",
    "company": "TechCorp Inc",
    "current_position": "CTO",
    "submission_date": "2025-11-05T09:30:00.000Z",
    "customer_base_range": ">1000000",
    "progress": "Form Submitted"
  }'

echo -e "\n\nLead added (High Budget - Nov 5 - Form Submitted)"