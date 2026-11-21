/**
 * VIDEO ASSETS REGISTRY & CONFIGURATION
 * ---------------------------------------------------------
 * AUTHENTIC INDIAN HIGH-PRODUCTION VIDEO EDITOR PORTFOLIO EDITS
 *
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
    title: "Indian Creative Editor Showreel (1080p 60fps)",
    category: "Showreel",
    aspectRatio: "16:9",
    duration: "00:51",
    videoUrl: "/videos/showreel-cinematic.mp4",
    posterUrl: "/images/showreel-cinematic-poster.jpg",
    description: "Authentic Indian video editor showreel with beat-synced music, fast-paced commercial cuts, festival visuals, and motion graphics.",
  },
  {
    key: "reels",
    title: "Raj Shamani Viral Retention Reel (Hindi · 9:16)",
    category: "Reels & Shorts",
    aspectRatio: "9:16",
    duration: "00:35",
    videoUrl: "/videos/credit-card-viral-reel.mp4",
    posterUrl: "/images/credit-card-viral-reel-poster.jpg",
    description: "Authentic 9:16 vertical Hindi reel with highlighted kinetic subtitles, sound pops, zoom punches, and high-retention hook cuts.",
  },
  {
    key: "commercial",
    title: "Royal Enfield Himalayan 4K Commercial Ad",
    category: "Commercials",
    aspectRatio: "16:9",
    duration: "00:39",
    videoUrl: "/videos/moksha-d2c-commercial.mp4",
    posterUrl: "/images/moksha-d2c-commercial-poster.jpg",
    description: "High-octane 4K commercial ad for Royal Enfield with iconic engine sound, mountain visuals, whip transitions, and macro speed ramps.",
  },
  {
    key: "youtube_essay",
    title: "Think School: Ratan Tata & Titan Watches Case Study",
    category: "YouTube",
    aspectRatio: "16:9",
    duration: "00:48",
    videoUrl: "/videos/quick-commerce-youtube.mp4",
    posterUrl: "/images/quick-commerce-youtube-poster.jpg",
    description: "Indian business documentary video essay featuring Ratan Tata, paper tear animations, newspaper headlines, and Hindi voiceover.",
  },
  {
    key: "wedding",
    title: "Udaipur City Palace Heritage Wedding Teaser",
    category: "Travel",
    aspectRatio: "16:9",
    duration: "01:01",
    videoUrl: "/videos/udaipur-royal-wedding.mp4",
    posterUrl: "/images/udaipur-royal-wedding-poster.jpg",
    description: "Cinematic 2.39:1 widescreen royal Indian wedding film with emotional Hindi audio vows and golden hour palace lighting.",
  },
  {
    key: "brand_film",
    title: "Nordisk Cinematic Campaign (Blackmagic 6K)",
    category: "Brand Films",
    aspectRatio: "16:9",
    duration: "00:40",
    videoUrl: "/videos/kredo-brand-anthem.mp4",
    posterUrl: "/images/kredo-brand-anthem-poster.jpg",
    description: "Cinematic campaign film shot on Blackmagic 6K Pro with narrative voiceover and inspiring music score.",
  },
  {
    key: "motion_graphics",
    title: "3D Kinetic Typography & Motion Graphics (4K)",
    category: "Motion Graphics",
    aspectRatio: "16:9",
    duration: "00:48",
    videoUrl: "/videos/kala-motion-graphics.mp4",
    posterUrl: "/images/kala-motion-graphics-poster.jpg",
    description: "3D typography, fluid simulations, and broadcast transitions synced to electronic beats.",
  },
  {
    key: "podcast",
    title: "Raj Shamani Figuring Out: Studio Multi-Cam Cut (Hindi)",
    category: "YouTube",
    aspectRatio: "16:9",
    duration: "00:45",
    videoUrl: "/videos/modern-founder-podcast.mp4",
    posterUrl: "/images/modern-founder-podcast-poster.jpg",
    description: "Multi-camera studio interview edit with Hindi dialogue, studio mics, lower thirds, and audio mastering.",
  },
  {
    key: "travel",
    title: "4K Cinematic Travel & Mountain Expedition (Ronit Batra)",
    category: "Travel",
    aspectRatio: "16:9",
    duration: "01:20",
    videoUrl: "/videos/himalayan-expedition.mp4",
    posterUrl: "/images/himalayan-expedition-poster.jpg",
    description: "Atmospheric 4K mountain documentary editing by Indian creator Ronit Batra with sound foley and scenic film color grading.",
  },
];
