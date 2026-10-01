import { createHmac, randomUUID } from "crypto";
import { cookies } from "next/headers";

export const VOTER_COOKIE_NAME = "adwrks_vid";
const VOTER_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidVoterId(value: string | undefined): value is string {
  return Boolean(value && UUID_RE.test(value));
}

export function createVoterHash(voterId: string, secret: string): string {
  return createHmac("sha256", secret).update(voterId).digest("hex");
}

/** Read or issue the httpOnly visitor UUID used for pseudonymous dedupe. */
export async function getOrCreateVoterId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(VOTER_COOKIE_NAME)?.value;

  if (isValidVoterId(existing)) {
    return existing;
  }

  const voterId = randomUUID();
  cookieStore.set(VOTER_COOKIE_NAME, voterId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: VOTER_COOKIE_MAX_AGE,
    path: "/",
  });

  return voterId;
}
