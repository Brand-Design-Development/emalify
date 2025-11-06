# Email Notification Setup

## Overview

The system now sends email notifications to admins when a new lead is received.

## Environment Variables

Add the following SMTP credentials to your `.env` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=noreply@example.com
SMTP_FROM_NAME=Emalify LMS
```

### Common SMTP Providers

#### Gmail

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # Use App Password, not regular password
SMTP_FROM_EMAIL=your-email@gmail.com
```

#### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM_EMAIL=your-verified-sender@example.com
```

#### AWS SES

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
SMTP_FROM_EMAIL=your-verified-email@example.com
```

## Admin Management

### Adding Admin Emails

You can add admin emails directly to the database:

```typescript
// Using Prisma Client
await prisma.admin.create({
  data: {
    email: "admin@example.com",
  },
});
```

Or using Prisma Studio:

```bash
npm run db:studio
```

Then navigate to the Admin table and add emails manually.

### Viewing Admin Emails

```typescript
const admins = await prisma.admin.findMany();
```

## Email Template

The notification email includes:

- Full Name
- Email (clickable mailto link)
- Phone Number (clickable tel link)
- Company
- Current Position
- Submission Date
- Label (color-coded badge)
- Progress Status

The email is styled with HTML and has a fallback plain text version.

## Error Handling

- If email sending fails, the lead is still created successfully
- Email errors are logged but don't affect the API response
- If no admin emails are configured, a warning is logged

## Testing

To test the email functionality:

1. Add an admin email to the database
2. Send a POST request to `/api/leads/new` with valid lead data
3. Check the admin's inbox for the notification email
