import Link from "next/link";
import AdminNav from "./AdminNav";
import { logout } from "../actions";
import { requireAdmin } from "@/lib/auth/dal";
import { adminCounts } from "@/lib/content";
import { getDb } from "@/lib/db";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const [db, counts] = await Promise.all([getDb(), adminCounts()]);

  return (
    <div className="min-h-dvh bg-paper">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <Link href="/admin" className="text-[15px] font-semibold">Portfolio admin</Link>
          <div className="flex items-center gap-4 text-[14px]">
            <Link href="/" target="_blank" className="link-u">View site</Link>
            <span className="hidden text-secondary-aa sm:inline">{admin.email}</span>
            <form action={logout}>
              <button type="submit" className="link-u">Sign out</button>
            </form>
          </div>
        </div>
      </header>

      {!db && (
        <p className="border-b border-amber-300 bg-amber-50 px-5 py-3 text-center text-[14px] text-amber-900">
          Read-only: no database is connected, so you are seeing the starter content. Set <code className="font-mono">DATABASE_URL</code> to save changes.
        </p>
      )}

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 md:grid-cols-[200px_1fr]">
        <aside>
          <AdminNav unread={counts.unread} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
