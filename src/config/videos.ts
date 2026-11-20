/**
 * VIDEO ASSETS REGISTRY & CONFIGURATION
 * ---------------------------------------------------------
 * HOW TO EASILY CHANGE VIDEOS IN THE FUTURE:
 *
 * METHOD 1 (ZERO CODE - EASIEST):
 * Simply replace the .mp4 file in `public/videos/` with your new video,
 * keeping the same filename (e.g., replace `public/videos/showreel-cinematic.mp4`).
 * Next.js will automatically serve the updated video immediately.
 *
 * METHOD 2 (ONE-LINE CONFIG):
 * Update the `videoUrl` or `posterUrl` in this file or in `src/lib/seed.ts`.
 * Supports:
 *   - Local MP4 files: "/videos/my-new-video.mp4"
 *   - YouTube URLs: "https://www.youtube.com/watch?v=..."
 *   - Vimeo URLs: "https://vimeo.com/..."
 *   - Free Cloud/CDN URLs: "https://res.cloudinary.com/..." or Supabase / S3
 *
 * METHOD 3 (BROWSER ADMIN PANEL):
 * Visit `/admin` in your browser to edit projects, videos, and posters directly.
 */

export interface VideoEntry {
  key: string;
  title: string;
  category: string;
  aspectRatio: "16:9" | "9:16";
  duration: string;
  videoUrl: string;
  posterUrl: string;
  description: string;
}

export const VIDEO_REGISTRY: VideoEntry[] = [
  {
    key: "showreel",
    title: "Master Portfolio Showreel",
    category: "Showreel",
    aspectRatio: "16:9",
    duration: "00:40",
    videoUrl: "/videos/showreel-cinematic.mp4",
    posterUrl: "/images/showreel-cinematic-poster.jpg",
    description: "High-energy commercial & narrative editing showreel with beat sync & sound foley.",
  },
  {
    key: "reels",
    title: "Viral Hook & Kinetic Subtitles",
    category: "Reels & Shorts",
    aspectRatio: "9:16",
    duration: "00:47",
    videoUrl: "/videos/credit-card-viral-reel.mp4",
    posterUrl: "/images/credit-card-viral-reel-poster.jpg",
    description: "9:16 vertical edit with animated captions, punch zooms, and retention pacing.",
  },
  {
    key: "commercial",
    title: "D2C Botanical Serum Commercial",
    category: "Commercials",
    aspectRatio: "16:9",
    duration: "00:50",
    videoUrl: "/videos/moksha-d2c-commercial.mp4",
    posterUrl: "/images/moksha-d2c-commercial-poster.jpg",
    description: "Product commercial with rhythmic cuts, macro textures, and color grade.",
  },
  {
    key: "youtube_essay",
    title: "Quick Commerce War (Documentary)",
    category: "YouTube",
    aspectRatio: "16:9",
    duration: "00:45",
    videoUrl: "/videos/quick-commerce-youtube.mp4",
    posterUrl: "/images/quick-commerce-youtube-poster.jpg",
    description: "Long-form YouTube video essay with paper textures and documentary sound design.",
  },
  {
    key: "wedding",
    title: "City Palace Heritage Wedding Teaser",
    category: "Travel",
    aspectRatio: "16:9",
    duration: "01:01",
    videoUrl: "/videos/udaipur-royal-wedding.mp4",
    posterUrl: "/images/udaipur-royal-wedding-poster.jpg",
    description: "Cinematic royal wedding highlight film with emotional vows and warm grading.",
  },
  {
    key: "brand_film",
    title: "Building The Frontier (Brand Anthem)",
    category: "Brand Films",
    aspectRatio: "16:9",
    duration: "00:40",
    videoUrl: "/videos/kredo-brand-anthem.mp4",
    posterUrl: "/images/kredo-brand-anthem-poster.jpg",
    description: "Cinematic campaign film shot on Blackmagic 6K Pro with narrative voiceover.",
  },
  {
    key: "podcast",
    title: "The Modern Founder (Multi-Cam Studio)",
    category: "YouTube",
    aspectRatio: "16:9",
    duration: "01:05",
    videoUrl: "/videos/modern-founder-podcast.mp4",
    posterUrl: "/images/modern-founder-podcast-poster.jpg",
    description: "Multi-angle studio interview cut with dialogue-driven switching and lower thirds.",
  },
  {
    key: "motion_graphics",
    title: "Kinetic Identity & 3D Typography",
    category: "Motion Graphics",
    aspectRatio: "16:9",
    duration: "00:48",
    videoUrl: "/videos/kala-motion-graphics.mp4",
    posterUrl: "/images/kala-motion-graphics-poster.jpg",
    description: "3D kinetic typography, logo packaging, and slick broadcast transitions.",
  },
  {
    key: "travel",
    title: "High-Altitude Himalayan Expedition",
    category: "Travel",
    aspectRatio: "16:9",
    duration: "01:05",
    videoUrl: "/videos/himalayan-expedition.mp4",
    posterUrl: "/images/himalayan-expedition-poster.jpg",
    description: "Atmospheric travel documentary editing with sound foley and scenic grades.",
  },
];
