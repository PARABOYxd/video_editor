import AboutPreview from "@/components/home/AboutPreview";
import ContactCTA from "@/components/home/ContactCTA";
import FeaturedWork from "@/components/home/FeaturedWork";
import Hero from "@/components/home/Hero";
import ServicesPreview from "@/components/home/ServicesPreview";
import Showreel from "@/components/home/Showreel";
import Testimonials from "@/components/home/Testimonials";
import { getProfile, getProjects, getServices, getTestimonials } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

// Refreshed immediately by revalidatePath() when the admin saves; this is a backstop.
export const revalidate = 3600;

export async function generateMetadata() {
  const profile = await getProfile();
  return pageMetadata({
    title: `${profile.brandName} · ${profile.roleTitle}`,
    description: profile.heroText,
    path: "/",
    image: profile.showreelPoster || profile.team[0]?.photoUrl,
  });
}

export default async function HomePage() {
  const [profile, projects, services, testimonials] = await Promise.all([getProfile(), getProjects(), getServices(), getTestimonials()]);
  const featured = projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects;

  return (
    <>
      <Hero profile={profile} featured={featured[0] ?? null} />
      <FeaturedWork projects={featured} total={projects.length} />
      <Showreel profile={profile} fallback={featured.find((p) => p.videoUrl) ?? null} />
      <ServicesPreview services={services} />
      <AboutPreview profile={profile} />
      <Testimonials items={testimonials} />
      <ContactCTA profile={profile} />
    </>
  );
}
