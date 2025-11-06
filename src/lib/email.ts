import nodemailer from "nodemailer";
import { env } from "@emalify/env";
import type { Lead } from "@prisma/client";

const logoUrl = "https://emalify.com/_nuxt/img/logo.45a07a1.png";
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});
function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export async function sendNewLeadNotification(
  lead: Lead,
  adminEmails: string[],
) {
  if (adminEmails.length === 0) {
    console.warn("No admin emails configured to send notification");
    return;
  }

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      max-width: 180px;
      height: auto;
    }
    .header {
      background-color: #0e75bc;
      color: white;
      padding: 24px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      background-color: #ffffff;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .field {
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f3f4f6;
    }
    .field:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    .field-label {
      font-weight: 600;
      color: #6b7280;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .field-value {
      color: #111827;
      font-size: 15px;
    }
    .field-value a {
      color: #0e75bc;
      text-decoration: none;
    }
    .field-value a:hover {
      text-decoration: underline;
    }
    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 600;
    }
    .badge-high {
      background-color: rgba(14, 117, 188, 0.15);
      color: #0e75bc;
    }
    .badge-medium {
      background-color: rgba(252, 209, 31, 0.15);
      color: #d97706;
    }
    .badge-low {
      background-color: rgba(52, 168, 83, 0.15);
      color: #34A853;
    }
    .badge-default {
      background-color: rgba(154, 160, 166, 0.15);
      color: #9AA0A6;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
    .footer a {
      color: #0e75bc;
      text-decoration: none;
      font-weight: 500;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .footer p {
      margin: 8px 0;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="${logoUrl}" alt="Emalify Logo" />
    </div>
    <div class="header">
      <h1>New Lead Received</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="field-label">Full Name</div>
        <div class="field-value">${lead.fullName}</div>
      </div>
      <div class="field">
        <div class="field-label">Email</div>
        <div class="field-value"><a href="mailto:${lead.email}">${lead.email}</a></div>
      </div>
      <div class="field">
        <div class="field-label">Phone Number</div>
        <div class="field-value"><a href="tel:${lead.phoneNumber}">${lead.phoneNumber}</a></div>
      </div>
      <div class="field">
        <div class="field-label">Company</div>
        <div class="field-value">${lead.company}</div>
      </div>
      <div class="field">
        <div class="field-label">Current Position</div>
        <div class="field-value">${lead.currentPosition}</div>
      </div>
      <div class="field">
        <div class="field-label">Submission Date</div>
        <div class="field-value">${lead.submissionDate.toLocaleString()}</div>
      </div>
      <div class="field">
        <div class="field-label">Budget Label</div>
        <div class="field-value">
          <span class="badge ${getBadgeClass(lead.label)}">${lead.label === "No Label" ? "No Label" : lead.label.replace(" Budget Lead", "")}</span>
        </div>
      </div>
      <div class="field">
        <div class="field-label">Progress Status</div>
        <div class="field-value">${lead.progress}</div>
      </div>
    </div>
    <div class="footer">
      <p><a href="${getBaseUrl()}" target="_blank">View in Emalify LMS Dashboard →</a></p>
      <p>Manage your leads efficiently with Emalify LMS</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const emailText = `
New Emalify Lead Received

Full Name: ${lead.fullName}
Email: ${lead.email}
Phone Number: ${lead.phoneNumber}
Company: ${lead.company}
Current Position: ${lead.currentPosition}
Submission Date: ${lead.submissionDate.toLocaleString()}
Label: ${lead.label}
Progress: ${lead.progress}
  `.trim();

  try {
    await transporter.sendMail({
      from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
      to: adminEmails.join(", "),
      subject: `New Emalify Lead: ${lead.fullName} from ${lead.company}`,
      text: emailText,
      html: emailHtml,
    });

    console.log(`Lead notification sent to ${adminEmails.length} admin(s)`);
  } catch (error) {
    console.error("Failed to send lead notification email:", error);
    throw error;
  }
}

function getBadgeClass(label: string): string {
  if (label === "High Budget Lead") return "badge-high";
  if (label === "Medium Budget Lead") return "badge-medium";
  if (label === "Low Budget Lead") return "badge-low";
  return "badge-default";
}
