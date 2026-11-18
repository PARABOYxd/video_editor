import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { getAdmin } from "@/lib/auth/dal";
import { adminConfigured } from "@/lib/env";

export const metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  if (await getAdmin()) redirect("/admin");
  const next = (await searchParams).next;
  return (
    <main className="flex min-h-dvh items-center justify-center bg-paper px-5">
      <div className="w-full max-w-sm">
        <p className="t-meta text-secondary-aa">Portfolio admin</p>
        <h1 className="t-section mt-3">Sign in</h1>
        {!adminConfigured && (
          <p className="mt-4 rounded border border-line bg-white p-4 text-[14px] text-ink">
            Login isn&apos;t set up yet. Run <code className="font-mono">pnpm admin:hash &quot;your-password&quot;</code> and add{" "}
            <code className="font-mono">ADMIN_EMAIL</code>, <code className="font-mono">ADMIN_PASSWORD_HASH</code> and{" "}
            <code className="font-mono">SESSION_SECRET</code> to your environment.
          </p>
        )}
        <LoginForm next={typeof next === "string" ? next : ""} />
      </div>
    </main>
  );
}
