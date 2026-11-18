import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "../env";
import { SESSION_COOKIE, verifySession } from "./session";

/**
 * The real authorization check. proxy.ts only does an optimistic redirect;
 * every admin page and every admin server action calls this.
 */
export async function getAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySession(token, env.sessionSecret);
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
