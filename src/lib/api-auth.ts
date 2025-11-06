import "server-only";
import { env } from "@emalify/env";
import { NextResponse } from "next/server";

/**
 * Verifies the API key from the request headers
 * @param request - The incoming request object
 * @returns NextResponse with error if invalid, null if valid
 */
export function verifyApiKey(request: Request): NextResponse | null {
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "API key is required. Please provide an API key in the 'x-api-key' header.",
      },
      { status: 401 },
    );
  }

  if (apiKey !== env.API_KEY) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
  }

  return null;
}
