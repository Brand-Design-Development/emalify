import { NextResponse } from "next/server";
import { db } from "@emalify/server/db";
import { z } from "zod";
import {
  LeadLabels,
  LeadLabelZod,
  LeadProgresses,
  LeadProgressZod,
} from "@emalify/lib/types";

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
  try {
    const body = await request.json();

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
