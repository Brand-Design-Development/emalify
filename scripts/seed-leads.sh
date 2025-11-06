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

echo "Adding sample leads to the database..."
echo "Using URL: $EMALIFY_HOME_URL"
echo ""

# Lead 1 - High Budget (>1000000)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Sarah Johnson",
    "email": "sarah.johnson@techcorp.com",
    "phone_number": "2125551234",
    "company": "TechCorp Inc",
    "current_position": "CTO",
    "submission_date": "2025-10-28T09:30:00.000Z",
    "customer_base_range": ">1000000"
  }'

echo -e "\n\nLead 1 added (High Budget - >1M customers)"

# Lead 2 - Medium Budget (50001-100000)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Michael Chen",
    "email": "michael.chen@startupxyz.io",
    "phone_number": "4155552345",
    "company": "StartupXYZ",
    "current_position": "CEO",
    "submission_date": "2025-10-27T14:20:00.000Z",
    "customer_base_range": "50001-100000"
  }'

echo -e "\n\nLead 2 added (Medium Budget - 50K-100K customers)"

# Lead 3 - High Budget (500000-999999)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Emily Rodriguez",
    "email": "emily.r@enterprise.com",
    "phone_number": "3105553456",
    "company": "Enterprise Solutions",
    "current_position": "VP of Marketing",
    "submission_date": "2025-10-26T11:45:00.000Z",
    "customer_base_range": "500000-999999"
  }'

echo -e "\n\nLead 3 added (High Budget - 500K-1M customers)"

# Lead 4 - Low Budget (1000-10000)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "David Kim",
    "email": "david.k@smallbiz.com",
    "phone_number": "6465554567",
    "company": "Small Business Co",
    "current_position": "Owner",
    "submission_date": "2025-10-25T16:10:00.000Z",
    "customer_base_range": "1000-10000"
  }'

echo -e "\n\nLead 4 added (Low Budget - 1K-10K customers)"

# Lead 5 - Medium Budget (10001-50000)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Jessica Martinez",
    "email": "jmartinez@midsize.com",
    "phone_number": "7185555678",
    "company": "MidSize Corp",
    "current_position": "Director of Sales",
    "submission_date": "2025-10-24T08:30:00.000Z",
    "customer_base_range": "10001-50000"
  }'

echo -e "\n\nLead 5 added (Medium Budget - 10K-50K customers)"

# Lead 6 - High Budget (200001-500000)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Robert Anderson",
    "email": "randerson@bigcorp.com",
    "phone_number": "2025556789",
    "company": "BigCorp Industries",
    "current_position": "CFO",
    "submission_date": "2025-10-23T13:15:00.000Z",
    "customer_base_range": "200001-500000"
  }'

echo -e "\n\nLead 6 added (High Budget - 200K-500K customers)"

# Lead 7 - Low Budget (0-1000)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Lisa Thompson",
    "email": "lisa.t@inactive.com",
    "phone_number": "3235557890",
    "company": "Inactive Business",
    "current_position": "Manager",
    "submission_date": "2025-10-22T10:00:00.000Z",
    "customer_base_range": "0-1000"
  }'

echo -e "\n\nLead 7 added (Low Budget - 0-1K customers)"

# Lead 8 - High Budget (100001-200000)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "James Wilson",
    "email": "jwilson@converted.com",
    "phone_number": "9175558901",
    "company": "Converted Client",
    "current_position": "CEO",
    "submission_date": "2025-10-20T15:30:00.000Z",
    "customer_base_range": "100001-200000"
  }'

echo -e "\n\nLead 8 added (Medium Budget - 100K-200K customers)"

# Lead 9 - Medium Budget (50001-100000)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Amanda Lee",
    "email": "alee@newlead.com",
    "phone_number": "5105559012",
    "company": "New Lead Inc",
    "current_position": "Product Manager",
    "submission_date": "2025-10-29T07:00:00.000Z",
    "customer_base_range": "50001-100000"
  }'

echo -e "\n\nLead 9 added (Medium Budget - 50K-100K customers)"

# Lead 10 - High Budget (>1000000)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Christopher Brown",
    "email": "cbrown@potential.com",
    "phone_number": "8585550123",
    "company": "Potential Corp",
    "current_position": "VP of Operations",
    "submission_date": "2025-10-28T12:45:00.000Z",
    "customer_base_range": ">1000000"
  }'

echo -e "\n\nLead 10 added (High Budget - >1M customers)"

# Lead 11 - No Label (no customer_base_range provided)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Patricia Green",
    "email": "pgreen@nolabel.com",
    "phone_number": "3035551111",
    "company": "Unknown Size Co",
    "current_position": "Marketing Director",
    "submission_date": "2025-10-30T10:00:00.000Z"
  }'

echo -e "\n\nLead 11 added (No Label - customer base not provided)"

echo -e "\n\n✅ All sample leads have been added!"
echo "You can now view them at $EMALIFY_HOME_URL"

echo -e "\n\n✅ All sample leads have been added!"
echo "You can now view them at $EMALIFY_HOME_URL"
