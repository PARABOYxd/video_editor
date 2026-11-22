import ProfileForm from "@/components/admin/ProfileForm";
import { requireAdmin } from "@/lib/auth/dal";
import { getProfile } from "@/lib/content";

export default async function AboutAdmin() {
  await requireAdmin();
  return (
    <div>
      <h1 className="t-h2 !text-title">About &amp; showreel</h1>
      <p className="mb-6 mt-1 text-body-sm text-secondary">Your names, photos, bio, software, contact details and showreel.</p>
      <ProfileForm profile={await getProfile()} />
    </div>
  );
}
