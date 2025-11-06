import nodemailer from "nodemailer";
import { env } from "@emalify/env";
import type { Lead } from "@prisma/client";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

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
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #4f46e5;
      color: white;
      padding: 20px;
      border-radius: 5px 5px 0 0;
    }
    .content {
      background-color: #f9fafb;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 0 0 5px 5px;
    }
    .field {
      margin-bottom: 15px;
    }
    .field-label {
      font-weight: bold;
      color: #4b5563;
    }
    .field-value {
      margin-top: 5px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
    }
    .badge-high {
      background-color: #dcfce7;
      color: #166534;
    }
    .badge-medium {
      background-color: #fef3c7;
      color: #92400e;
    }
    .badge-low {
      background-color: #dbeafe;
      color: #1e40af;
    }
    .badge-default {
      background-color: #f3f4f6;
      color: #374151;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🎯 New Emalify Lead Received</h1>
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
        <div class="field-label">Label</div>
        <div class="field-value">
          <span class="badge ${getBadgeClass(lead.label)}">${lead.label}</span>
        </div>
      </div>
      <div class="field">
        <div class="field-label">Progress</div>
        <div class="field-value">${lead.progress}</div>
      </div>
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
