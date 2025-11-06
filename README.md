# Emalify LMS

[https://emalify-lms.vercel.app](https://emalify-lms.vercel.app)

## API Documentation

### POST /api/leads/new

Creates a new lead in the system and sends email notifications to all admins.

#### Authentication

This endpoint requires API key authentication. Include your API key in the request headers:

```
x-api-key: YOUR_API_KEY
```

#### Request

**Method:** `POST`

**URL:** `/api/leads/new`

**Headers:**

- `Content-Type: application/json`
- `x-api-key: YOUR_API_KEY`

**Body Parameters:**

| Parameter             | Type             | Required | Description                                                      |
| --------------------- | ---------------- | -------- | ---------------------------------------------------------------- |
| `full_name`           | string           | Yes      | The lead's full name                                             |
| `email`               | string           | Yes      | The lead's email address (must be valid email format)            |
| `phone_number`        | string \| number | Yes      | The lead's phone number                                          |
| `company`             | string           | Yes      | The lead's company name                                          |
| `current_position`    | string           | Yes      | The lead's current job position                                  |
| `submission_date`     | string           | No       | ISO 8601 date string (defaults to current date/time)             |
| `customer_base_range` | string           | No       | Customer base range (e.g., "0-10000", "10000-200000", ">200000") |
| `progress`            | string           | No       | Lead progress status (defaults to "Form Submitted")              |
| `is_new`              | boolean          | No       | Whether this is a new lead (defaults to true)                    |

**Label Assignment:**

The system automatically assigns a label based on the `customer_base_range`:

- **High Budget Lead**: > 200,000 customers
- **Medium Budget Lead**: 10,001 - 200,000 customers
- **Low Budget Lead**: 0 - 10,000 customers
- **No Label**: If `customer_base_range` is not provided

#### Example Request

```bash
curl -X POST https://emalify-lms.vercel.app/api/leads/new \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "phone_number": "+1234567890",
    "company": "Acme Corp",
    "current_position": "CEO",
    "customer_base_range": "10000-200000",
    "submission_date": "2025-11-06T10:00:00Z"
  }'
```

#### Response

**Success Response (201 Created):**

```json
{
  "success": true,
  "lead": {
    "id": "clxxx...",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "company": "Acme Corp",
    "currentPosition": "CEO",
    "submissionDate": "2025-11-06T10:00:00.000Z",
    "progress": "Form Submitted",
    "label": "Medium Budget Lead"
  }
}
```

**Error Responses:**

**401 Unauthorized:**

```json
{
  "error": "API key is required. Please provide an API key in the 'x-api-key' header."
}
```

**403 Forbidden:**

```json
{
  "error": "Invalid API key"
}
```

**400 Bad Request:**

```json
{
  "error": "Invalid data format",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["full_name"],
      "message": "Required"
    }
  ]
}
```

**500 Internal Server Error:**

```json
{
  "error": "Internal server error"
}
```

#### JavaScript/TypeScript Example

```typescript
async function createLead(leadData) {
  const response = await fetch("https://emalify-lms.vercel.app/api/leads/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.EMALIFY_API_KEY,
    },
    body: JSON.stringify({
      full_name: leadData.fullName,
      email: leadData.email,
      phone_number: leadData.phoneNumber,
      company: leadData.company,
      current_position: leadData.currentPosition,
      customer_base_range: leadData.customerBaseRange,
      submission_date: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}
```

#### Notes

- Email notifications are automatically sent to all admin users when a new lead is created
- If email notification fails, the lead will still be created successfully
- The `submission_date` must be a valid ISO 8601 date string
- The `customer_base_range` format should match patterns like "0-10000", "10000-200000", or ">200000"
