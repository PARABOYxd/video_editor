"use client";

import ErrorView from "@/components/layout/ErrorView";
import "./globals.css";

/** Last resort, when the root layout itself fails: it has to render html and body. */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en-IN">
      <body>
        <title>Something went wrong | Rytora Studio</title>
        <main id="main">
          <ErrorView error={error} retry={retry} />
        </main>
      </body>
    </html>
  );
}
