import AboutPreview from "@/components/home/AboutPreview";
import Faq from "@/components/home/Faq";
import FeaturedWork from "@/components/home/FeaturedWork";
import Hero from "@/components/home/Hero";
import Process from "@/components/home/Process";
import ServicesPreview from "@/components/home/ServicesPreview";
import Showreel from "@/components/home/Showreel";
import SocialProof from "@/components/home/SocialProof";
import Testimonials from "@/components/home/Testimonials";
import JsonLd from "@/components/seo/JsonLd";
import { getProfile, getProjects, getServices, getTestimonials } from "@/lib/content";
import { pageMetadata, siteJsonLd } from "@/lib/seo";

// Refreshed immediately by revalidatePath() when the admin saves; this is a backstop.
export const revalidate = 3600;

export async function generateMetadata() {
  const profile = await getProfile();
  return pageMetadata({
    title: "Video Editors in Pune for YouTube & Reels | Rytora Studio",
    absolute: true,
    description: `${profile.brandName} are video editors in Pune, India, offering YouTube video editing, Instagram Reels editing, brand films and cinematic travel videos.`,
    path: "/",
    image: profile.showreelPoster || undefined,
    og: "home",
  });
}

export default async function HomePage() {
  const [profile, projects, services, testimonials] = await Promise.all([getProfile(), getProjects(), getServices(), getTestimonials()]);
  const featured = projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects;

  return (
    <>
      <JsonLd data={siteJsonLd(profile, services)} />
      <Hero profile={profile} />
      <div id="after-hero">
        <SocialProof />
        <Showreel profile={profile} />
        <FeaturedWork projects={featured} total={projects.length} />
      </div>
      <ServicesPreview services={services} />
      <Process />
      <Testimonials items={testimonials} />
      <AboutPreview profile={profile} />
      <Faq />
    </>
  );
}
