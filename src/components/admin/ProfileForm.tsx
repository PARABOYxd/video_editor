"use client";

import { useActionState } from "react";
import { saveProfile, type FormState } from "@/app/admin/actions";
import { Field, FormMessage, Submit } from "./ui";
import { useFormAction } from "../useFormAction";
import type { Profile } from "@/lib/types";
import Card from "@/components/ui/Card";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card as="section" padding="none" className="p-5 sm:p-6">
      <h2 className="mb-5 text-body font-semibold">{title}</h2>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </Card>
  );
}

const wide = "sm:col-span-2";
const fileCls = "field-input file:mr-3 file:rounded file:border-0 file:bg-paper file:px-3 file:py-1";

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(saveProfile, { status: "idle" } as FormState);
  const onSubmit = useFormAction(action);
  const e = state.errors ?? {};
  const input = (name: keyof Profile, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input id={name} name={name} defaultValue={String(profile[name] ?? "")} className="field-input" {...extra} />
  );
  const area = (name: keyof Profile, value: string, rows = 3) => (
    <textarea id={name} name={name} rows={rows} defaultValue={value} className="field-input" />
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Panel title="Showreel">
        <div className={wide}>
          <Field label="Showreel link" name="showreelUrl" error={e.showreelUrl} hint="Your own reel on YouTube, Vimeo, or a direct .mp4 link. Leave empty to hide the showreel block on the homepage.">
            {input("showreelUrl", { type: "url", placeholder: "https://vimeo.com/…" })}
          </Field>
        </div>
        <Field label="Upload poster image" name="showreelPosterFile" hint="Optional; YouTube links use their own thumbnail.">
          <input id="showreelPosterFile" name="showreelPosterFile" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className={fileCls} />
        </Field>
        <Field label="…or poster URL" name="showreelPoster">
          {input("showreelPoster")}
        </Field>
        <div className={wide}>
          <Field label="Showreel captions (.vtt, optional)" name="showreelCaptions" hint="For an MP4 / WebM reel with speech.">
            {input("showreelCaptions")}
          </Field>
        </div>
      </Panel>

      <Panel title="Identity and hero">
        <Field label="Full name(s)" name="brandName">{input("brandName")}</Field>
        <Field label="Short name" name="shortName" hint="Used in the header, e.g. “Rishab & Kunal”.">{input("shortName")}</Field>
        <Field label="Role" name="roleTitle">{input("roleTitle")}</Field>
        <Field label="Location" name="location">{input("location")}</Field>
        <div className={wide}>
          <Field label="Availability" name="availability" hint="Shown with a red dot at the top of the home page. Leave empty to hide.">{input("availability")}</Field>
        </div>
        <div className={wide}>
          <Field label="Hero label" name="heroLabel" hint="The small line above the headline.">{input("heroLabel")}</Field>
        </div>
        <div className={wide}>
          <Field label="Hero headline" name="heroHeadline" hint="The word “every” is set in italic automatically.">{input("heroHeadline")}</Field>
        </div>
        <div className={wide}>
          <Field label="Hero text" name="heroText">{area("heroText", profile.heroText, 2)}</Field>
        </div>
        <div className={wide}>
          <Field label="Footer description" name="footerBlurb">{area("footerBlurb", profile.footerBlurb, 2)}</Field>
        </div>
      </Panel>

      <Panel title="About">
        <div className={wide}><Field label="Introduction" name="intro">{area("intro", profile.intro)}</Field></div>
        <div className={wide}><Field label="Creative philosophy" name="philosophy">{area("philosophy", profile.philosophy)}</Field></div>
        <div className={wide}><Field label="Editing approach" name="approach" hint="Pacing, storytelling, sound, composition, detail.">{area("approach", profile.approach)}</Field></div>
        <div className={wide}><Field label="Professional journey" name="experience">{area("experience", profile.experience)}</Field></div>
        <div className={wide}><Field label="What makes your approach different" name="difference">{area("difference", profile.difference)}</Field></div>
        <div className={wide}>
          <Field label="Software" name="software" hint="One per line. List only what you actually use.">
            {area("software", profile.software.join("\n"), 5)}
          </Field>
        </div>
      </Panel>

      {profile.team.map((m, i) => (
        <Panel key={i} title={`Person ${i + 1}: ${m.name}`}>
          <Field label="Name" name={`team${i}_name`}>
            <input id={`team${i}_name`} name={`team${i}_name`} defaultValue={m.name} className="field-input" />
          </Field>
          <Field label="Role" name={`team${i}_role`}>
            <input id={`team${i}_role`} name={`team${i}_role`} defaultValue={m.role} className="field-input" />
          </Field>
          <div className={wide}>
            <Field label="Short bio" name={`team${i}_bio`}>
              <textarea id={`team${i}_bio`} name={`team${i}_bio`} rows={2} defaultValue={m.bio} className="field-input" />
            </Field>
          </div>
          <Field label="Upload new photo" name={`team${i}_photoFile`} hint="Portrait, 4:5 works best.">
            <input id={`team${i}_photoFile`} name={`team${i}_photoFile`} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className={fileCls} />
          </Field>
          <Field label="…or photo URL" name={`team${i}_photoUrl`}>
            <input id={`team${i}_photoUrl`} name={`team${i}_photoUrl`} defaultValue={m.photoUrl} className="field-input" />
          </Field>
        </Panel>
      ))}

      <Panel title="Contact">
        <Field label="Email" name="email">{input("email", { type: "email" })}</Field>
        <Field label="Phone (as displayed)" name="phone">{input("phone")}</Field>
        <Field label="WhatsApp number" name="whatsapp" hint="Country code + number, e.g. 919820012345.">{input("whatsapp", { inputMode: "numeric" })}</Field>
        <div className={wide}>
          <Field label="Social links" name="socials" hint="One per line as Label | https://link, e.g. Instagram | https://instagram.com/you">
            {area("socials", profile.socials.map((s) => `${s.label} | ${s.url}`).join("\n"), 4)}
          </Field>
        </div>
      </Panel>

      <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center gap-4 bg-paper/95 px-1 py-4 backdrop-blur">
        <Submit pending={pending}>Save changes</Submit>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
