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

// A tiny warm gradient in the site's palette, shown until the image arrives.
const BLUR = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAF0lEQVQI12O4ceXMiUM7GaZN7Nq0ZgkAPrcIbwpBjHEAAAAASUVORK5CYII=";

/**
 * next/image that also accepts any pasted URL: hosts that aren't configured
 * are shown unoptimised instead of throwing at runtime.
 */
export default function Img({ alt, ...props }: Omit<ImageProps, "src"> & { src: string }) {
  return <Image alt={alt} placeholder="blur" blurDataURL={BLUR} {...props} unoptimized={!canOptimise(props.src)} />;
}
