import Button from "@/components/ui/Button";
import StatusPage from "./StatusPage";

export default function NotFoundView() {
  return (
    <StatusPage
      code="Error 404"
      title={
        <>
          Cut from the <em className="t-italic">final</em> edit.
        </>
      }
      text="This page doesn't exist, or it has moved."
    >
      <Button href="/" arrow>
        Back to home
      </Button>
      <Button href="/work" variant="link" arrow>
        See the work
      </Button>
      <Button href="/contact" variant="link" arrow>
        Contact us
      </Button>
    </StatusPage>
  );
}
