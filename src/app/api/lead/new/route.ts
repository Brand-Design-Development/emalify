import { NextResponse } from "next/server";
import { db } from "@emalify/server/db";
import { z } from "zod";
import { LeadLabelZod, LeadProgressZod } from "@emalify/lib/types";
import { verifyApiKey } from "@emalify/lib/api-auth";

/**
 * POST /api/lead/new
 * Creates a new lead in the database
 *
 * Authentication: Requires API key in 'x-api-key' header
 *
 * Example usage:
 * ```
 * fetch('/api/lead/new', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'x-api-key': 'your-api-key-here'
 *   },
 *   body: JSON.stringify({
 *     "Full Name": "John Doe",
 *     "Email Address": "john@example.com",
 *     "Phone Number": "1234567890",
 *     "Company": "Example Corp",
 *     "Current Position": "CEO",
 *     "Submission Date": "2024-01-01T00:00:00Z",
 *     "Label": "High Budget Lead",
 *     "threadId": "unique-thread-id",
 *     "formMode": "standard",
 *     "Progress": "Form Submitted"
 *   })
 * })
 * ```
 */

const leadSchema = z.object({
  "Full Name": z.string(),
  "Email Address": z.string().email(),
  "Phone Number": z.union([z.string(), z.number()]),
  Company: z.string(),
  "Current Position": z.string(),
  "Submission Date": z.string(),
  Label: LeadLabelZod,
  threadId: z.string(),
  formMode: z.string(),
  Progress: LeadProgressZod,
});

export async function POST(request: Request) {
  // Verify API key
  const authError = verifyApiKey(request);
  if (authError) {
    return authError;
  }

  try {
    const body: unknown = await request.json();

    const validatedData = leadSchema.parse(body);

    // Check if lead already exists with this threadId
    const existingLead = await db.lead.findUnique({
      where: { threadId: validatedData.threadId },
    });

    if (existingLead) {
      return NextResponse.json(
        { error: "Lead with this threadId already exists" },
        { status: 409 },
      );
    }

    // Create new lead
    const lead = await db.lead.create({
      data: {
        fullName: validatedData["Full Name"],
        email: validatedData["Email Address"],
        phoneNumber: validatedData["Phone Number"].toString(),
        company: validatedData.Company,
        currentPosition: validatedData["Current Position"],
        submissionDate: new Date(validatedData["Submission Date"]),
        label: validatedData.Label,
        progress: validatedData.Progress,
        threadId: validatedData.threadId,
        formMode: validatedData.formMode,
      },
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data format", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
