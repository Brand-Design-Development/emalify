#!/usr/bin/env bash

set -e

# Sample leads data for testing the Emalify Lead Management System

# Use environment variable or default to localhost:3000
EMALIFY_HOME_URL=${EMALIFY_HOME_URL:-http://localhost:3000}

echo "Adding sample leads to the database..."
echo "Using URL: $EMALIFY_HOME_URL"
echo ""

# Lead 1 - High Budget
curl -X POST $EMALIFY_HOME_URL/api/lead/new \
  -H "Content-Type: application/json" \
  -d '{
    "Full Name": "Sarah Johnson",
    "Email Address": "sarah.johnson@techcorp.com",
    "Phone Number": "2125551234",
    "Company": "TechCorp Inc",
    "Current Position": "CTO",
    "Submission Date": "2025-10-28T09:30:00.000Z",
    "Label": "High Budget Lead",
    "threadId": "thread_001_sarah",
    "formMode": "production",
    "Progress": "Demo Call Booked"
  }'

echo -e "\n\nLead 1 added"

# Lead 2 - Medium Budget
curl -X POST $EMALIFY_HOME_URL/api/lead/new \
  -H "Content-Type: application/json" \
  -d '{
    "Full Name": "Michael Chen",
    "Email Address": "michael.chen@startupxyz.io",
    "Phone Number": "4155552345",
    "Company": "StartupXYZ",
    "Current Position": "CEO",
    "Submission Date": "2025-10-27T14:20:00.000Z",
    "Label": "Medium Budget Lead",
    "threadId": "thread_002_michael",
    "formMode": "production",
    "Progress": "Potential Lead"
  }'

echo -e "\n\nLead 2 added"

# Lead 3 - High Budget
curl -X POST $EMALIFY_HOME_URL/api/lead/new \
  -H "Content-Type: application/json" \
  -d '{
    "Full Name": "Emily Rodriguez",
    "Email Address": "emily.r@enterprise.com",
    "Phone Number": "3105553456",
    "Company": "Enterprise Solutions",
    "Current Position": "VP of Marketing",
    "Submission Date": "2025-10-26T11:45:00.000Z",
    "Label": "High Budget Lead",
    "threadId": "thread_003_emily",
    "formMode": "production",
    "Progress": "Converted"
  }'

echo -e "\n\nLead 3 added"

# Lead 4 - Low Budget
curl -X POST $EMALIFY_HOME_URL/api/lead/new \
  -H "Content-Type: application/json" \
  -d '{
    "Full Name": "David Kim",
    "Email Address": "david.k@smallbiz.com",
    "Phone Number": "6465554567",
    "Company": "Small Business Co",
    "Current Position": "Owner",
    "Submission Date": "2025-10-25T16:10:00.000Z",
    "Label": "Low Budget Lead",
    "threadId": "thread_004_david",
    "formMode": "production",
    "Progress": "Form Submitted"
  }'

echo -e "\n\nLead 4 added"

# Lead 5 - Medium Budget
curl -X POST $EMALIFY_HOME_URL/api/lead/new \
  -H "Content-Type: application/json" \
  -d '{
    "Full Name": "Jessica Martinez",
    "Email Address": "jmartinez@midsize.com",
    "Phone Number": "7185555678",
    "Company": "MidSize Corp",
    "Current Position": "Director of Sales",
    "Submission Date": "2025-10-24T08:30:00.000Z",
    "Label": "Medium Budget Lead",
    "threadId": "thread_005_jessica",
    "formMode": "production",
    "Progress": "Demo Call Booked"
  }'

echo -e "\n\nLead 5 added"

# Lead 6 - High Budget
curl -X POST $EMALIFY_HOME_URL/api/lead/new \
  -H "Content-Type: application/json" \
  -d '{
    "Full Name": "Robert Anderson",
    "Email Address": "randerson@bigcorp.com",
    "Phone Number": "2025556789",
    "Company": "BigCorp Industries",
    "Current Position": "CFO",
    "Submission Date": "2025-10-23T13:15:00.000Z",
    "Label": "High Budget Lead",
    "threadId": "thread_006_robert",
    "formMode": "production",
    "Progress": "Potential Lead"
  }'

echo -e "\n\nLead 6 added"

# Lead 7 - Dead Lead
curl -X POST $EMALIFY_HOME_URL/api/lead/new \
  -H "Content-Type: application/json" \
  -d '{
    "Full Name": "Lisa Thompson",
    "Email Address": "lisa.t@inactive.com",
    "Phone Number": "3235557890",
    "Company": "Inactive Business",
    "Current Position": "Manager",
    "Submission Date": "2025-10-22T10:00:00.000Z",
    "Label": "Low Budget Lead",
    "threadId": "thread_007_lisa",
    "formMode": "production",
    "Progress": "Dead Lead"
  }'

echo -e "\n\nLead 7 added"

# Lead 8 - Converted
curl -X POST $EMALIFY_HOME_URL/api/lead/new \
  -H "Content-Type: application/json" \
  -d '{
    "Full Name": "James Wilson",
    "Email Address": "jwilson@converted.com",
    "Phone Number": "9175558901",
    "Company": "Converted Client",
    "Current Position": "CEO",
    "Submission Date": "2025-10-20T15:30:00.000Z",
    "Label": "High Budget Lead",
    "threadId": "thread_008_james",
    "formMode": "production",
    "Progress": "Converted"
  }'

echo -e "\n\nLead 8 added"

# Lead 9 - Form Submitted
curl -X POST $EMALIFY_HOME_URL/api/lead/new \
  -H "Content-Type: application/json" \
  -d '{
    "Full Name": "Amanda Lee",
    "Email Address": "alee@newlead.com",
    "Phone Number": "5105559012",
    "Company": "New Lead Inc",
    "Current Position": "Product Manager",
    "Submission Date": "2025-10-29T07:00:00.000Z",
    "Label": "Medium Budget Lead",
    "threadId": "thread_009_amanda",
    "formMode": "production",
    "Progress": "Form Submitted"
  }'

echo -e "\n\nLead 9 added"

# Lead 10 - Potential Lead
curl -X POST $EMALIFY_HOME_URL/api/lead/new \
  -H "Content-Type: application/json" \
  -d '{
    "Full Name": "Christopher Brown",
    "Email Address": "cbrown@potential.com",
    "Phone Number": "8585550123",
    "Company": "Potential Corp",
    "Current Position": "VP of Operations",
    "Submission Date": "2025-10-28T12:45:00.000Z",
    "Label": "High Budget Lead",
    "threadId": "thread_010_chris",
    "formMode": "production",
    "Progress": "Potential Lead"
  }'

echo -e "\n\nLead 10 added"

echo -e "\n\n✅ All sample leads have been added!"
echo "You can now view them at $EMALIFY_HOME_URL"
