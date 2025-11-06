import { NextResponse } from "next/server";
import { cleanupExpiredSessions } from "@emalify/lib/auth";
import { env } from "@emalify/env";

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await cleanupExpiredSessions();

    return NextResponse.json({
      success: true,
      message: "Expired sessions cleaned up successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to cleanup expired sessions:", error);
    return NextResponse.json(
      { error: "Failed to cleanup sessions" },
      { status: 500 },
    );
  }
}
