"use client";

import { useEffect } from "react";

// No imports but React, on purpose: error boundaries ship in every page's first
// load, and <Button>, icons and next/link would add ~18 KB to each of them.
export default function ErrorView({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-site flex min-h-[70dvh] flex-col justify-center py-24">
      <p className="t-meta text-secondary">Something went wrong</p>
      <h1 className="t-display mt-6 max-w-headline">
        We lost the <em className="t-italic">signal.</em>
      </h1>
      <p className="t-lead mt-6 text-secondary">That didn&apos;t load. Try again, or head back to the homepage.</p>
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <button type="button" className="btn btn-primary" onClick={() => retry()}>
          Try again
        </button>
        {/* A full page load is the point here: it clears whatever broke. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="link-arrow">
          Back to home
        </a>
      </div>
    </section>
  );
}
