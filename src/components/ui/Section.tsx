import clsx from "clsx";
import Container from "./Container";

type Props = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  /** Background and borders run edge to edge; the content stays in the container. */
  bleed?: boolean;
  /** Classes for the inner container. Only used with `bleed`. */
  innerClassName?: string;
};

/** Contained block with the fluid vertical rhythm every section shares. */
export default function Section({ as: Tag = "section", bleed = false, innerClassName, className, children, ...props }: Props) {
  if (bleed) {
    return (
      <Tag className={className} {...props}>
        <Container className={clsx("section", innerClassName)}>{children}</Container>
      </Tag>
    );
  }
  return (
    <Container as={Tag} className={clsx("section", className)} {...props}>
      {children}
    </Container>
  );
}
