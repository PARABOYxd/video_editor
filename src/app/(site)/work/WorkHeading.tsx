import SectionHeader from "@/components/ui/SectionHeader";

export default function WorkHeading() {
  return (
    <div className="mt-8">
      <SectionHeader
        as="h1"
        eyebrow="Portfolio"
        title="The work speaks."
        description="A collection of projects, experiments and stories brought together through editing, by our video editors in Pune."
      />
    </div>
  );
}
