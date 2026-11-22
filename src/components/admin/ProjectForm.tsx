"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveProject, type FormState } from "@/app/admin/actions";
import { Field, FormMessage, Submit } from "./ui";
import { useFormAction } from "../useFormAction";
import { ASPECT_RATIOS, type Category, type Project, type ProjectKind } from "@/lib/types";
import { parseVideo } from "@/lib/video";
import Card from "@/components/ui/Card";

const IMAGE_TYPES = "image/jpeg,image/png,image/webp,image/avif";
const fileCls = "field-input file:mr-3 file:rounded file:border-0 file:bg-paper file:px-3 file:py-1";

function Panel({ title, hint, children, cols = 2 }: { title: string; hint?: string; children: React.ReactNode; cols?: 2 | 3 }) {
  return (
    <Card as="fieldset" padding="none" className="p-5 sm:p-6">
      <legend className="sr-only">{title}</legend>
      <p className="text-body font-semibold">{title}</p>
      {hint && <p className="mt-1 text-label text-secondary">{hint}</p>}
      <div className={`mt-5 grid gap-5 ${cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>{children}</div>
    </Card>
  );
}

export default function ProjectForm({ project, categories }: { project?: Project; categories: Category[] }) {
  const [state, action, pending] = useActionState(saveProject, { status: "idle" } as FormState);
  const onSubmit = useFormAction(action);
  const [videoUrl, setVideoUrl] = useState(project?.videoUrl ?? "");
  const [kind, setKind] = useState<ProjectKind | "">(project?.projectType ?? "");
  const e = state.errors ?? {};
  const video = parseVideo(videoUrl);
  const wide = "sm:col-span-2";
  const text = (name: keyof Project, rows = 4, hint?: string, label?: string) => (
    <div className={wide}>
      <Field label={label ?? String(name)} name={name} hint={hint} error={e[name]}>
        <textarea id={name} name={name} rows={rows} defaultValue={String(project?.[name] ?? "")} className="field-input" aria-invalid={!!e[name]} />
      </Field>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {project && <input type="hidden" name="id" value={project.id} />}

      <Panel title="Basics">
        <div className={wide}>
          <Field label="Title" name="title" error={e.title}>
            <input id="title" name="title" required defaultValue={project?.title} className="field-input" aria-invalid={!!e.title} />
          </Field>
        </div>
        <Field label="Category" name="categoryId" error={e.categoryId}>
          <select id="categoryId" name="categoryId" defaultValue={project?.categoryId ?? ""} className="field-input">
            <option value="">Uncategorised</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Year" name="year" error={e.year}>
          <input id="year" name="year" inputMode="numeric" maxLength={4} defaultValue={project?.year ?? String(new Date().getFullYear())} className="field-input" />
        </Field>
        <Field label="Client (optional)" name="client" hint="Only name a client who has agreed to it." error={e.client}>
          <input id="client" name="client" defaultValue={project?.client} className="field-input" />
        </Field>
        <Field label="Format or platform" name="clientType" hint="e.g. “Travel film” or “YouTube channel”." error={e.clientType}>
          <input id="clientType" name="clientType" defaultValue={project?.clientType} className="field-input" />
        </Field>
        {text("summary", 2, "One or two lines: shown on the grid and at the top of the project page.", "Short description")}
      </Panel>

      <Panel title="Ownership" hint="Only publish edits you made yourselves.">
        <Field
          label="Project type"
          name="projectType"
          hint="Until this is set, search engines aren't told the work is yours."
          error={e.projectType}
        >
          <select id="projectType" name="projectType" value={kind} onChange={(ev) => setKind(ev.target.value as ProjectKind | "")} className="field-input">
            <option value="">Not set</option>
            <option value="client">Client work</option>
            <option value="spec">Spec project</option>
          </select>
        </Field>
        <Field
          label={kind === "spec" ? "Footage source (required)" : "Footage source (optional)"}
          name="footageSource"
          hint="Shown on the project page. Spec projects may only use royalty-free or licensed footage, e.g. “Pexels”."
          error={e.footageSource}
        >
          <input
            id="footageSource"
            name="footageSource"
            maxLength={120}
            required={kind === "spec"}
            defaultValue={project?.footageSource}
            className="field-input"
            aria-invalid={!!e.footageSource}
          />
        </Field>
      </Panel>

      <Panel title="Video and images">
        <div className={wide}>
          <Field label="Video link" name="videoUrl" hint="YouTube, Vimeo (unlisted works), or a direct .mp4 / .webm link." error={e.videoUrl}>
            <input
              id="videoUrl"
              name="videoUrl"
              type="url"
              value={videoUrl}
              onChange={(ev) => setVideoUrl(ev.target.value)}
              placeholder="https://vimeo.com/…"
              className="field-input"
              aria-invalid={!!e.videoUrl}
            />
          </Field>
          {videoUrl && (
            <p className="mt-2 text-label text-secondary">
              {video.kind === "none" ? "Not recognised yet." : `Recognised: ${video.kind === "file" ? "video file (custom player)" : video.kind}.`}
              {video.kind === "youtube" && " The YouTube still is used if you don't upload a thumbnail."}
            </p>
          )}
        </div>
        <Field label="Aspect ratio" name="aspectRatio" hint="9:16 and 4:5 show as a vertical player.">
          <select id="aspectRatio" name="aspectRatio" defaultValue={project?.aspectRatio ?? "16:9"} className="field-input">
            {ASPECT_RATIOS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field label="Duration" name="duration" hint="mm:ss or h:mm:ss" error={e.duration}>
          <input id="duration" name="duration" defaultValue={project?.duration} placeholder="01:30" className="field-input" aria-invalid={!!e.duration} />
        </Field>
        <Field label="Upload thumbnail" name="thumbnailFile" hint="A still from the edit. JPG/PNG/WebP/AVIF, max 4 MB.">
          <input id="thumbnailFile" name="thumbnailFile" type="file" accept={IMAGE_TYPES} className={fileCls} />
        </Field>
        <Field label="…or thumbnail URL" name="thumbnailUrl" error={e.thumbnailUrl}>
          <input id="thumbnailUrl" name="thumbnailUrl" defaultValue={project?.thumbnailUrl} className="field-input" />
        </Field>
        <Field label="Upload video poster (optional)" name="posterFile" hint="Shown in the player before play. Defaults to the thumbnail.">
          <input id="posterFile" name="posterFile" type="file" accept={IMAGE_TYPES} className={fileCls} />
        </Field>
        <Field label="…or poster URL" name="posterUrl" error={e.posterUrl}>
          <input id="posterUrl" name="posterUrl" defaultValue={project?.posterUrl} className="field-input" />
        </Field>
        <div className={wide}>
          <Field
            label="Captions file (.vtt, optional)"
            name="captionsUrl"
            hint="For MP4 / WebM with speech. A path on this site, or a link on a host that allows CORS."
            error={e.captionsUrl}
          >
            <input id="captionsUrl" name="captionsUrl" defaultValue={project?.captionsUrl} className="field-input" />
          </Field>
        </div>
        <Field label="Add stills to the gallery" name="galleryFiles" hint="Up to 12 extra images for the project page.">
          <input id="galleryFiles" name="galleryFiles" type="file" multiple accept={IMAGE_TYPES} className={fileCls} />
        </Field>
        <Field label="Gallery image URLs" name="gallery" hint="One per line. Delete a line to remove an image." error={e.gallery}>
          <textarea id="gallery" name="gallery" rows={3} defaultValue={project?.gallery.join("\n")} className="field-input" />
        </Field>
      </Panel>

      <Panel title="Case study" hint="Each section appears on the project page only when it has text. Leave a blank line between paragraphs.">
        {text("description", 4, undefined, "Overview")}
        {text("background", 3, "Shown under “Brief”: who it was for and why it was made.", "Project background")}
        {text("objective", 3, "Also under “Brief”: what the edit needed to achieve.", "Creative objective")}
        {text("approach", 4, "How you approached pacing, sound, colour and structure.", "Editing approach")}
        {text("result", 3, "What changed or was delivered. Only claim numbers you can back up.", "Result")}
        {text("role", 2, "What you did on this project.", "Your role")}
        <div className={wide}>
          <Field label="Software used" name="software" hint="One per line." error={e.software}>
            <textarea id="software" name="software" rows={3} defaultValue={project?.software.join("\n")} className="field-input" />
          </Field>
        </div>
      </Panel>

      <Panel title="Search and display" cols={3}>
        <Field label="SEO title (optional)" name="seoTitle" hint="Defaults to the project title." error={e.seoTitle}>
          <input id="seoTitle" name="seoTitle" maxLength={70} defaultValue={project?.seoTitle} className="field-input" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="SEO description (optional)" name="seoDescription" hint="Defaults to the short description." error={e.seoDescription}>
            <input id="seoDescription" name="seoDescription" maxLength={170} defaultValue={project?.seoDescription} className="field-input" />
          </Field>
        </div>
        <Field label="URL slug" name="slug" hint="Leave empty to build it from the title." error={e.slug}>
          <input id="slug" name="slug" defaultValue={project?.slug} className="field-input" aria-invalid={!!e.slug} />
        </Field>
        <Field label="Order" name="sort" hint="Lower numbers show first.">
          <input id="sort" name="sort" type="number" min={0} defaultValue={project?.sort ?? 0} className="field-input" />
        </Field>
        <div className="space-y-3 pt-7">
          <label className="flex items-center gap-2 text-body-sm">
            <input type="checkbox" name="published" defaultChecked={project?.published ?? true} className="h-4 w-4" /> Published
          </label>
          <label className="flex items-center gap-2 text-body-sm">
            <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} className="h-4 w-4" /> Featured on home page
          </label>
        </div>
      </Panel>

      <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center gap-4 bg-paper/95 px-1 py-4">
        <Submit pending={pending}>{project ? "Save changes" : "Add project"}</Submit>
        <Link href="/admin/projects" className="link-u text-small">Cancel</Link>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
