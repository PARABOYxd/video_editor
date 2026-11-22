import type { Profile } from "./types";

/*
 * Starter content, written to the database on first run and served
 * read-only when there is no database. Everything is editable in /admin.
 *
 * - The profile (names, roles, software, bio facts) comes from the previous
 *   version of this site. Copy is in the first person plural: this is a duo.
 * - There are no starter projects and no showreel. Only the studio's own
 *   work, added in /admin, appears on the site.
 * - There are no testimonials. Add genuine ones only.
 */

export const seedProfile: Profile = {
  brandName: "Rytora Studio",
  shortName: "Rytora Studio",
  roleTitle: "Video Editors",
  location: "Pune, India · Working worldwide",
  availability: "Open for projects · Nov – Dec 2026",
  heroLabel: "Independent video editors / Visual storytellers",
  heroHeadline: "We make every frame matter.",
  heroText:
    "We create thoughtful, visually engaging films and digital content through editing, storytelling and a strong attention to detail.",
  footerBlurb: "A two-person video editing duo cutting films, reels and digital content for creators, brands and businesses.",
  intro:
    "We are Rishab Jain and Kunal Gophane, a two-person video editing duo working with YouTube creators, brands and agencies.",
  philosophy:
    "Good editing is invisible until you feel it. The cut should serve the story first, and every choice about pace, sound and colour should make that story easier to feel.",
  approach:
    "We start with the story and the audience, then shape pacing, sound and visual composition around them. Rhythm decides where a cut lands; sound carries more of the emotion than people expect; colour keeps a piece consistent from the first frame to the last.",
  experience:
    "Two years of hands-on editing across YouTube videos, Instagram Reels, brand films and commercials.",
  difference:
    "There are two of us. We split narrative assembly, sound, colour and motion between us, so every project gets a second pair of eyes before it reaches you.",
  software: ["Adobe Premiere Pro", "Adobe After Effects", "DaVinci Resolve", "Adobe Audition"],
  team: [
    {
      name: "Rishab Jain",
      role: "Video Editor",
      photoUrl: "/images/editor-portrait-alt.jpg",
      bio: "Narrative pacing, YouTube edits, commercial cuts and multi-cam storytelling.",
    },
    {
      name: "Kunal Gophane",
      role: "Video Editor",
      photoUrl: "/images/editor-portrait.jpg",
      bio: "Reels and Shorts pacing, motion graphics, captions and colour finishing.",
    },
  ],
  email: "hello@rishabkunal.studio",
  phone: "+91 98000 00000",
  whatsapp: "919800000000",
  socials: [
    { label: "Instagram", url: "https://instagram.com/rishabkunal.edits" },
    { label: "LinkedIn", url: "https://linkedin.com/in/rishab-jain-editor" },
    { label: "YouTube", url: "https://youtube.com/@rishabkunaledits" },
  ],
  showreelUrl: "",
  showreelPoster: "",
};

export const seedCategories = ["Reels & Shorts", "YouTube", "Brand Films", "Commercials", "Travel", "Motion Graphics"];

export const seedServices: { title: string; description: string; deliverables: string; idealFor: string; process: string }[] = [
  {
    title: "Social Media Videos",
    description: "Short-form edits for Reels, Shorts and feeds, cut to hold attention from the first second.",
    deliverables: "Vertical and square exports, burned-in or separate captions, and a clean version without text.",
    idealFor: "Creators, founders and brands posting regularly on Instagram, YouTube Shorts and LinkedIn.",
    process: "You share raw clips and references; we cut, caption, add sound design, and revise with you.",
  },
  {
    title: "YouTube Content",
    description: "Long-form edits structured for clarity and steady pacing, from talking head to documentary style.",
    deliverables: "A 16:9 master, chapter timestamps on request, and short cut-downs for promotion.",
    idealFor: "YouTube channels, educators, explainers and video essays.",
    process: "We agree the structure first, then build the edit with B-roll, graphics and a clean audio mix.",
  },
  {
    title: "Brand Films & Commercials",
    description: "Brand films and ads cut to the brief, delivered in every format your campaign needs.",
    deliverables: "Masters in the sizes you need, with versions for different platforms and lengths.",
    idealFor: "Product launches, brand stories, campaign ads and agency projects.",
    process: "Brief and references, a first cut, focused rounds of feedback, then final delivery.",
  },
  {
    title: "Cinematic Videos",
    description: "Travel and cinematic edits shaped around place, music and colour.",
    deliverables: "A graded master plus social-length versions.",
    idealFor: "Travel creators, hospitality, events and personal films.",
    process: "We find the story in your footage, build the rhythm to music, then grade and finish.",
  },
  {
    title: "Motion Graphics",
    description: "Titles, lower thirds, animated text and logo reveals that match your brand.",
    deliverables: "Rendered animations and, where useful, templates you can reuse.",
    idealFor: "Video series, channels and brands that need a consistent look.",
    process: "We design from your brand, animate, and adjust timing with you.",
  },
  {
    title: "Podcast Editing",
    description: "Multi-camera podcast episodes with clean cuts, levelled audio and short clips for social.",
    deliverables: "The full episode plus short vertical clips from its best moments.",
    idealFor: "Video podcasts and interview shows.",
    process: "We sync cameras, cut to the conversation, clean the audio and pull clips.",
  },
];
