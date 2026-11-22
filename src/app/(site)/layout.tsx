import ClosingCTA from "@/components/layout/ClosingCTA";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HideOnPath from "@/components/layout/HideOnPath";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CustomCursor from "@/components/motion/CustomCursor";
import PageTransition from "@/components/motion/PageTransition";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { getProfile, getServices } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [profile, services] = await Promise.all([getProfile(), getServices()]);
  const chat = profile.whatsapp
    ? {
        href: `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(`Hi ${profile.shortName}, I have a project in mind.`)}`,
        label: "Chat with us on WhatsApp",
      }
    : { href: "/contact", label: "Contact us" };

  return (
    <div id="top">
      <a
        href="#main"
        data-behind-menu
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-skip focus:rounded focus:bg-ink focus:px-4 focus:py-3 focus:text-on-dark"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} data-behind-menu>
        {children}
      </main>
      <HideOnPath path="/contact">
        <div data-behind-menu>
          <ClosingCTA profile={profile} />
        </div>
      </HideOnPath>
      <Footer profile={profile} services={services} />
      <WhatsAppButton {...chat} />
      <ScrollReveal />
      <PageTransition />
      <CustomCursor />
    </div>
  );
}
