import { notFound, redirect } from "next/navigation";
import { getProfile } from "@/lib/content";

export const dynamic = "force-dynamic";

/** The old /showreel link: opens the reel on the homepage, or 404s while there is none. */
export async function GET() {
  if (!(await getProfile()).showreelUrl) notFound();
  redirect("/#showreel");
}
