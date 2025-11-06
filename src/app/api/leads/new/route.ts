import { NextResponse } from "next/server";
import { db } from "@emalify/server/db";
import { z } from "zod";
import {
  LeadProgressZod,
  type LeadLabel,
  type LeadProgress,
} from "@emalify/lib/types";
import { verifyApiKey } from "@emalify/lib/api-auth";

const leadSchema = z.object({
  full_name: z.string(),
  email: z.string().email(),
  phone_number: z.union([z.string(), z.number()]),
  company: z.string(),
  current_position: z.string(),
  submission_date: z.string().optional(),
  customer_base_range: z.string().optional(),
  progress: LeadProgressZod.default("Form Submitted"),
});

type Range = {
  min: number;
  max: number | undefined;
};

function parseMinAndMax(customerBaseRange: string): Range | undefined {
  const parsePart = (part: string) => {
    const stripped = part.replace(/\D/g, "");
    const num = parseInt(stripped, 10);
    return isNaN(num) ? undefined : num;
  };
  if (customerBaseRange.startsWith(">")) {
    const min = parsePart(customerBaseRange);
    if (min === undefined) return undefined;
    return { min, max: undefined };
  }
  const parts = customerBaseRange.split("-");
  if (parts.length < 2) return undefined;
  const min = parsePart(parts[0]!);
  const max = parsePart(parts[1]!);
  if (min === undefined || max === undefined) return undefined;
  return { min, max };
}

function parseLeadLabel({ min }: Range): LeadLabel {
  if (min > 200_000) {
    return "High Budget Lead";
  }
  if (min > 10_000) {
    return "Medium Budget Lead";
  }
  return "Low Budget Lead";
}

export async function POST(request: Request) {
  // Verify API key
  const authError = verifyApiKey(request);
  if (authError) {
    return authError;
  }

  try {
    const body: unknown = await request.json();

    const validatedData = leadSchema.parse(body);
    let parsedSubmissionDate: Date | undefined = undefined;
    if (validatedData.submission_date) {
      parsedSubmissionDate = new Date(validatedData.submission_date);
      if (isNaN(parsedSubmissionDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid submission_date format" },
          { status: 400 },
        );
      }
    }

    // Create new lead
    let label: LeadLabel = "No Label";
    const customerBaseRange = validatedData.customer_base_range;
    if (customerBaseRange) {
      const range = parseMinAndMax(customerBaseRange);
      if (!range) {
        return NextResponse.json(
          { error: "Invalid customer_base_range format" },
          { status: 400 },
        );
      }
      label = parseLeadLabel(range);
    }
    const lead = await db.lead.create({
      data: {
        fullName: validatedData.full_name,
        email: validatedData.email,
        phoneNumber: validatedData.phone_number.toString(),
        company: validatedData.company,
        currentPosition: validatedData.current_position,
        submissionDate: parsedSubmissionDate ?? new Date(),
        progress: validatedData.progress,
        label: label,
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
