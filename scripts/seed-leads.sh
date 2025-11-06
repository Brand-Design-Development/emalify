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

echo -e "\n\nLead 1 added (High Budget - Nov 5 - Form Submitted)"

# Lead 2 - Medium Budget - Demo Booked (Nov 3)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Michael Chen",
    "email": "michael.chen@startupxyz.io",
    "phone_number": "4155552345",
    "company": "StartupXYZ",
    "current_position": "CEO",
    "submission_date": "2025-11-03T14:20:00.000Z",
    "customer_base_range": "50001-100000",
    "progress": "Demo Booked"
  }'

echo -e "\n\nLead 2 added (Medium Budget - Nov 3 - Demo Booked)"

# Lead 3 - High Budget - Converted (Oct 28)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Emily Rodriguez",
    "email": "emily.r@enterprise.com",
    "phone_number": "3105553456",
    "company": "Enterprise Solutions",
    "current_position": "VP of Marketing",
    "submission_date": "2025-10-28T11:45:00.000Z",
    "customer_base_range": "500000-999999",
    "progress": "Converted"
  }'

echo -e "\n\nLead 3 added (High Budget - Oct 28 - Converted)"

# Lead 4 - Low Budget - Dead Lead (Oct 15)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "David Kim",
    "email": "david.k@smallbiz.com",
    "phone_number": "6465554567",
    "company": "Small Business Co",
    "current_position": "Owner",
    "submission_date": "2025-10-15T16:10:00.000Z",
    "customer_base_range": "1000-10000",
    "progress": "Dead Lead"
  }'

echo -e "\n\nLead 4 added (Low Budget - Oct 15 - Dead Lead)"

# Lead 5 - Medium Budget - Potential Lead (Oct 24)
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
    "customer_base_range": "10001-50000",
    "progress": "Potential Lead"
  }'

echo -e "\n\nLead 5 added (Medium Budget - Oct 24 - Potential Lead)"

# Lead 6 - High Budget - Demo Booked (Oct 23)
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
    "customer_base_range": "200001-500000",
    "progress": "Demo Booked"
  }'

echo -e "\n\nLead 6 added (High Budget - Oct 23 - Demo Booked)"

# Lead 7 - Low Budget - Dead Lead (Oct 12)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Lisa Thompson",
    "email": "lisa.t@inactive.com",
    "phone_number": "3235557890",
    "company": "Inactive Business",
    "current_position": "Manager",
    "submission_date": "2025-10-12T10:00:00.000Z",
    "customer_base_range": "0-1000",
    "progress": "Dead Lead"
  }'

echo -e "\n\nLead 7 added (Low Budget - Oct 12 - Dead Lead)"

# Lead 8 - High Budget - Converted (Oct 20)
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
    "customer_base_range": "100001-200000",
    "progress": "Converted"
  }'

echo -e "\n\nLead 8 added (Medium Budget - Oct 20 - Converted)"

# Lead 9 - Medium Budget - Form Submitted (Nov 4)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Amanda Lee",
    "email": "alee@newlead.com",
    "phone_number": "5105559012",
    "company": "New Lead Inc",
    "current_position": "Product Manager",
    "submission_date": "2025-11-04T07:00:00.000Z",
    "customer_base_range": "50001-100000",
    "progress": "Form Submitted"
  }'

echo -e "\n\nLead 9 added (Medium Budget - Nov 4 - Form Submitted)"

# Lead 10 - High Budget - Potential Lead (Oct 30)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Christopher Brown",
    "email": "cbrown@potential.com",
    "phone_number": "8585550123",
    "company": "Potential Corp",
    "current_position": "VP of Operations",
    "submission_date": "2025-10-30T12:45:00.000Z",
    "customer_base_range": ">1000000",
    "progress": "Potential Lead"
  }'

echo -e "\n\nLead 10 added (High Budget - Oct 30 - Potential Lead)"

# Lead 11 - No Label - Form Submitted (Nov 2)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Patricia Green",
    "email": "pgreen@nolabel.com",
    "phone_number": "3035551111",
    "company": "Unknown Size Co",
    "current_position": "Marketing Director",
    "submission_date": "2025-11-02T10:00:00.000Z",
    "progress": "Form Submitted"
  }'

echo -e "\n\nLead 11 added (No Label - Nov 2 - Form Submitted)"

# Lead 12 - High Budget - Converted (Oct 18)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Thomas Wright",
    "email": "twright@successco.com",
    "phone_number": "6175551234",
    "company": "Success Company",
    "current_position": "President",
    "submission_date": "2025-10-18T09:00:00.000Z",
    "customer_base_range": "500000-999999",
    "progress": "Converted"
  }'

echo -e "\n\nLead 12 added (High Budget - Oct 18 - Converted)"

# Lead 13 - Medium Budget - Demo Booked (Oct 31)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Maria Garcia",
    "email": "mgarcia@growthinc.com",
    "phone_number": "3125552345",
    "company": "Growth Inc",
    "current_position": "CMO",
    "submission_date": "2025-10-31T14:30:00.000Z",
    "customer_base_range": "50001-100000",
    "progress": "Demo Booked"
  }'

echo -e "\n\nLead 13 added (Medium Budget - Oct 31 - Demo Booked)"

# Lead 14 - Low Budget - Form Submitted (Nov 1)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Daniel Taylor",
    "email": "dtaylor@startsmall.com",
    "phone_number": "7185553456",
    "company": "Start Small LLC",
    "current_position": "Founder",
    "submission_date": "2025-11-01T11:15:00.000Z",
    "customer_base_range": "1000-10000",
    "progress": "Form Submitted"
  }'

echo -e "\n\nLead 14 added (Low Budget - Nov 1 - Form Submitted)"

# Lead 15 - High Budget - Potential Lead (Oct 27)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Rebecca Davis",
    "email": "rdavis@enterprise2.com",
    "phone_number": "4155554567",
    "company": "Enterprise Two",
    "current_position": "Director",
    "submission_date": "2025-10-27T16:45:00.000Z",
    "customer_base_range": "200001-500000",
    "progress": "Potential Lead"
  }'

echo -e "\n\nLead 15 added (High Budget - Oct 27 - Potential Lead)"

# Lead 16 - Medium Budget - Converted (Oct 16)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Steven Martinez",
    "email": "smartinez@winner.com",
    "phone_number": "6465555678",
    "company": "Winner Corp",
    "current_position": "VP Sales",
    "submission_date": "2025-10-16T13:20:00.000Z",
    "customer_base_range": "10001-50000",
    "progress": "Converted"
  }'

echo -e "\n\nLead 16 added (Medium Budget - Oct 16 - Converted)"

# Lead 17 - High Budget - Demo Booked (Oct 29)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Jennifer Lopez",
    "email": "jlopez@bigbrand.com",
    "phone_number": "2025556789",
    "company": "Big Brand Co",
    "current_position": "COO",
    "submission_date": "2025-10-29T10:30:00.000Z",
    "customer_base_range": ">1000000",
    "progress": "Demo Booked"
  }'

echo -e "\n\nLead 17 added (High Budget - Oct 29 - Demo Booked)"

# Lead 18 - Low Budget - Potential Lead (Oct 25)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Kevin White",
    "email": "kwhite@boutique.com",
    "phone_number": "3235557890",
    "company": "Boutique Shop",
    "current_position": "Owner",
    "submission_date": "2025-10-25T15:00:00.000Z",
    "customer_base_range": "0-1000",
    "progress": "Potential Lead"
  }'

echo -e "\n\nLead 18 added (Low Budget - Oct 25 - Potential Lead)"

# Lead 19 - Medium Budget - Form Submitted (Nov 5)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Angela Moore",
    "email": "amoore@mediumco.com",
    "phone_number": "9175558901",
    "company": "Medium Company",
    "current_position": "Manager",
    "submission_date": "2025-11-05T08:15:00.000Z",
    "customer_base_range": "50001-100000",
    "progress": "Form Submitted"
  }'

echo -e "\n\nLead 19 added (Medium Budget - Nov 5 - Form Submitted)"

# Lead 20 - High Budget - Converted (Oct 14)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Ryan Johnson",
    "email": "rjohnson@megacorp.com",
    "phone_number": "5105559012",
    "company": "MegaCorp",
    "current_position": "Executive VP",
    "submission_date": "2025-10-14T12:00:00.000Z",
    "customer_base_range": "500000-999999",
    "progress": "Converted"
  }'

echo -e "\n\nLead 20 added (High Budget - Oct 14 - Converted)"

# Lead 21 - Medium Budget - Dead Lead (Oct 10)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Nicole Brown",
    "email": "nbrown@noresponse.com",
    "phone_number": "8585550123",
    "company": "No Response LLC",
    "current_position": "Director",
    "submission_date": "2025-10-10T09:30:00.000Z",
    "customer_base_range": "10001-50000",
    "progress": "Dead Lead"
  }'

echo -e "\n\nLead 21 added (Medium Budget - Oct 10 - Dead Lead)"

# Lead 22 - High Budget - Demo Booked (Nov 4)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Brandon Lee",
    "email": "blee@promisecorp.com",
    "phone_number": "3035551111",
    "company": "Promise Corporation",
    "current_position": "CTO",
    "submission_date": "2025-11-04T14:45:00.000Z",
    "customer_base_range": "200001-500000",
    "progress": "Demo Booked"
  }'

echo -e "\n\nLead 22 added (High Budget - Nov 4 - Demo Booked)"

# Lead 23 - Low Budget - Form Submitted (Oct 26)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Melissa Clark",
    "email": "mclark@tinybiz.com",
    "phone_number": "6175551234",
    "company": "Tiny Business",
    "current_position": "CEO",
    "submission_date": "2025-10-26T10:20:00.000Z",
    "customer_base_range": "1000-10000",
    "progress": "Form Submitted"
  }'

echo -e "\n\nLead 23 added (Low Budget - Oct 26 - Form Submitted)"

# Lead 24 - High Budget - Potential Lead (Oct 22)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Joshua Harris",
    "email": "jharris@hugeenterprise.com",
    "phone_number": "3125552345",
    "company": "Huge Enterprise",
    "current_position": "VP Marketing",
    "submission_date": "2025-10-22T11:30:00.000Z",
    "customer_base_range": ">1000000",
    "progress": "Potential Lead"
  }'

echo -e "\n\nLead 24 added (High Budget - Oct 22 - Potential Lead)"

# Lead 25 - Medium Budget - Converted (Oct 19)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Stephanie King",
    "email": "sking@champion.com",
    "phone_number": "7185553456",
    "company": "Champion Co",
    "current_position": "President",
    "submission_date": "2025-10-19T15:15:00.000Z",
    "customer_base_range": "50001-100000",
    "progress": "Converted"
  }'

echo -e "\n\nLead 25 added (Medium Budget - Oct 19 - Converted)"

# Lead 26 - High Budget - Form Submitted (Nov 6)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Gregory Scott",
    "email": "gscott@fresh.com",
    "phone_number": "4155554567",
    "company": "Fresh Corp",
    "current_position": "CFO",
    "submission_date": "2025-11-06T09:00:00.000Z",
    "customer_base_range": "500000-999999",
    "progress": "Form Submitted"
  }'

echo -e "\n\nLead 26 added (High Budget - Nov 6 - Form Submitted)"

# Lead 27 - Low Budget - Dead Lead (Oct 8)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Rachel Adams",
    "email": "radams@gone.com",
    "phone_number": "2025556789",
    "company": "Gone Forever",
    "current_position": "Owner",
    "submission_date": "2025-10-08T16:00:00.000Z",
    "customer_base_range": "0-1000",
    "progress": "Dead Lead"
  }'

echo -e "\n\nLead 27 added (Low Budget - Oct 8 - Dead Lead)"

# Lead 28 - Medium Budget - Demo Booked (Oct 21)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Tyler Nelson",
    "email": "tnelson@rising.com",
    "phone_number": "6465555678",
    "company": "Rising Star Inc",
    "current_position": "COO",
    "submission_date": "2025-10-21T13:45:00.000Z",
    "customer_base_range": "10001-50000",
    "progress": "Demo Booked"
  }'

echo -e "\n\nLead 28 added (Medium Budget - Oct 21 - Demo Booked)"

# Lead 29 - High Budget - Potential Lead (Nov 3)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Lauren Mitchell",
    "email": "lmitchell@toplevel.com",
    "phone_number": "3235557890",
    "company": "Top Level Corp",
    "current_position": "Managing Director",
    "submission_date": "2025-11-03T10:30:00.000Z",
    "customer_base_range": "200001-500000",
    "progress": "Potential Lead"
  }'

echo -e "\n\nLead 29 added (High Budget - Nov 3 - Potential Lead)"

# Lead 30 - Medium Budget - Form Submitted (Nov 6)
curl -X POST $EMALIFY_HOME_URL/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: $EMALIFY_LMS_API_KEY" \
  -d '{
    "full_name": "Aaron Roberts",
    "email": "aroberts@juststarted.com",
    "phone_number": "9175558901",
    "company": "Just Started LLC",
    "current_position": "Founder",
    "submission_date": "2025-11-06T11:00:00.000Z",
    "customer_base_range": "50001-100000",
    "progress": "Form Submitted"
  }'

echo -e "\n\nLead 30 added (Medium Budget - Nov 6 - Form Submitted)"

echo -e "\n\n✅ All sample leads have been added!"
echo "You can now view them at $EMALIFY_HOME_URL"

echo -e "\n\n✅ All sample leads have been added!"
echo "You can now view them at $EMALIFY_HOME_URL"
