import Image, { type ImageProps } from "next/image";

// Hosts next/image may optimise; must match next.config.ts remotePatterns.
const OPTIMISED = [/\.public\.blob\.vercel-storage\.com$/, /^i\.ytimg\.com$/];

function canOptimise(src: string) {
  if (src.startsWith("/")) return true;
  try {
    return OPTIMISED.some((re) => re.test(new URL(src).hostname));
  } catch {
    return false;
  }
}

/**
 * next/image that also accepts any pasted URL: hosts that aren't configured
 * are shown unoptimised instead of throwing at runtime.
 */
export default function Img({ alt, ...props }: Omit<ImageProps, "src"> & { src: string }) {
  return <Image alt={alt} {...props} unoptimized={!canOptimise(props.src)} />;
}
