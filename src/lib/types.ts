export type TeamMember = {
  name: string;
  role: string;
  photoUrl: string;
  bio: string;
};

export type SocialLink = { label: string; url: string };

/** Identity, About copy, contact details and showreel. Stored as one JSON row. */
export type Profile = {
  brandName: string; // "Rishab Jain & Kunal Gophane"
  shortName: string; // "Rishab & Kunal"
  roleTitle: string; // "Video Editors"
  location: string;
  availability: string;
  heroLabel: string;
  heroHeadline: string;
  heroText: string;
  footerBlurb: string;
  intro: string;
  philosophy: string;
  approach: string;
  experience: string; // professional journey
  difference: string; // what makes the approach different
  software: string[];
  team: TeamMember[];
  email: string;
  phone: string;
  whatsapp: string; // digits only, with country code
  socials: SocialLink[];
  showreelUrl: string; // YouTube / Vimeo / MP4 / WebM link to the editors' own reel
  showreelPoster: string;
};

export type Category = { id: number; name: string; slug: string; sort: number };

export const ASPECT_RATIOS = ["16:9", "21:9", "4:3", "1:1", "4:5", "9:16"] as const;
export type AspectRatio = (typeof ASPECT_RATIOS)[number];

export type Project = {
  id: number;
  slug: string;
  title: string;
  categoryId: number | null;
  categoryName: string | null;
  categorySlug: string | null;
  client: string; // optional, only when the client agrees to be named
  clientType: string; // platform or kind of client, e.g. "YouTube channel"
  summary: string; // short description (grid + intro)
  description: string; // full description
  background: string;
  objective: string;
  approach: string;
  role: string;
  software: string[];
  duration: string;
  videoUrl: string;
  posterUrl: string;
  thumbnailUrl: string;
  aspectRatio: AspectRatio;
  gallery: string[];
  year: string;
  featured: boolean;
  published: boolean;
  isSample: boolean;
  sort: number;
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
};

export type Service = {
  id: number;
  title: string;
  description: string;
  deliverables: string; // what the client receives
  idealFor: string; // what kind of projects it suits
  process: string; // what the editing process involves
  sort: number;
};

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  quote: string;
  photoUrl: string;
  published: boolean;
  sort: number;
};

export type Inquiry = {
  id: number;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  deadline: string;
  message: string;
  read: boolean;
  createdAt: string;
};
