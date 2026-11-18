import Link from "next/link";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="container-site flex min-h-dvh flex-col justify-center py-24">
      <p className="t-meta flex items-center gap-3 text-secondary-aa">
        <span aria-hidden className="h-px w-8 bg-accent" />
        Error 404
      </p>
      <h1 className="t-hero mt-6 max-w-[12ch]">
        Cut from the <em className="t-italic">final</em> edit.
      </h1>
      <p className="t-lead mt-6 max-w-md text-secondary-aa">This page doesn&apos;t exist, or it has moved.</p>
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Link href="/" className="btn btn-primary">Back to home <span className="arrow" aria-hidden>→</span></Link>
        <Link href="/work" className="link-arrow">See the work <span className="arrow" aria-hidden>→</span></Link>
      </div>
    </main>
  );
}
