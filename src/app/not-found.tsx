import Link from "next/link";
import Logo from "@/components/layout/Logo";
import NotFoundView from "@/components/layout/NotFoundView";
import Container from "@/components/ui/Container";

export const metadata = { title: "Page not found" };

/** Unmatched URLs render outside the site layout, so this brings its own header and landmarks. */
export default function NotFound() {
  return (
    <>
      <header className="border-b border-line">
        <Container className="flex h-header items-center md:h-header-lg">
          <Link href="/" className="flex min-h-11 items-center">
            <Logo />
            <span className="sr-only"> home</span>
          </Link>
        </Container>
      </header>
      <main id="main">
        <NotFoundView />
      </main>
    </>
  );
}
