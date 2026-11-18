import ProfileForm from "@/components/admin/ProfileForm";
import { requireAdmin } from "@/lib/auth/dal";
import { getProfile } from "@/lib/content";

export default async function AboutAdmin() {
  await requireAdmin();
  return (
    <div>
      <h1 className="t-section !text-[40px]">About &amp; showreel</h1>
      <p className="mb-6 mt-1 text-[15px] text-secondary-aa">Your names, photos, bio, software, contact details and showreel.</p>
      <ProfileForm profile={await getProfile()} />
    </div>
  );
}
