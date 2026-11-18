import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getProfile } from "@/lib/content";
import { siteJsonLd } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  return (
    <div id="top">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd(profile)) }} />
      <Header name={profile.shortName} />
      <main id="main">{children}</main>
      <Footer profile={profile} />
    </div>
  );
}
