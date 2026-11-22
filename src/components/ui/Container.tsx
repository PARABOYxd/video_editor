import clsx from "clsx";

type Props = React.HTMLAttributes<HTMLElement> & { as?: React.ElementType };

/** The one page width: 1408px max with a fluid gutter. */
export default function Container({ as: Tag = "div", className, ...props }: Props) {
  return <Tag className={clsx("container-site", className)} {...props} />;
}
