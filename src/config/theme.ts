/**
 * Colours for places CSS variables can't reach (browser theme-color, manifest,
 * OG images). Everything else uses the tokens in src/app/globals.css, so keep
 * these in step with them.
 */
export const THEME = { paper: "#f5f3ee", ink: "#171717", accent: "#a64d32", onDark: "#ffffff" } as const;
