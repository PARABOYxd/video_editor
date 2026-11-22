"use client";

import ErrorView from "@/components/layout/ErrorView";

/** Catches a failing site layout, so it brings its own landmark. */
export default function RootError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <main id="main">
      <ErrorView error={error} retry={retry} />
    </main>
  );
}
