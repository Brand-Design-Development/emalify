import "server-only";
import { db } from "@emalify/server/db";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { env } from "@emalify/env";

const SESSION_DURATION = env.SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000; // Convert days to milliseconds

export async function createSession(): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await db.session.create({
    data: {
      token,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { token },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await db.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return token;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;

  if (token) {
    await db.session.deleteMany({
      where: { token },
    });
  }

  cookieStore.delete(env.SESSION_COOKIE_NAME);
}

export async function cleanupExpiredSessions(): Promise<void> {
  await db.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}
