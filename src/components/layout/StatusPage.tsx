import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";

/** Shared body of the 404 and error pages. */
export default function StatusPage({ code, title, text, children }: { code: string; title: React.ReactNode; text: string; children: React.ReactNode }) {
  return (
    <Container as="section" className="flex min-h-[70dvh] flex-col justify-center py-24">
      <Eyebrow>{code}</Eyebrow>
      <h1 className="t-display mt-6 max-w-headline">{title}</h1>
      <p className="t-lead mt-6 text-secondary">{text}</p>
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">{children}</div>
    </Container>
  );
}
