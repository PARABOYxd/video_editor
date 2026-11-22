import { Clapperboard, Film, Mic, MonitorPlay, Mountain, Scissors, Shapes, Smartphone, type LucideIcon } from "lucide-react";

// First match wins; a service added in the admin falls back to scissors.
const ICONS: [RegExp, LucideIcon][] = [
  [/social|reel|short/, Smartphone],
  [/youtube/, MonitorPlay],
  [/brand|commercial/, Clapperboard],
  [/cinematic|travel/, Mountain],
  [/motion/, Shapes],
  [/podcast/, Mic],
  [/wedding|film/, Film],
];

export default function ServiceIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = ICONS.find(([pattern]) => pattern.test(slug))?.[1] ?? Scissors;
  return <Icon aria-hidden className={className} strokeWidth={1.5} />;
}
