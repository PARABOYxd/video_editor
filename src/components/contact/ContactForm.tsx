"use client";

import { useActionState } from "react";
import { submitInquiry, type InquiryState } from "@/app/actions/inquiry";
import { BUDGETS, DEADLINES, PROJECT_TYPES } from "@/lib/validation";
import { useFormAction } from "../useFormAction";

const initial: InquiryState = { status: "idle" };

/**
 * Six fields, one column on mobile, two on desktop. Errors appear inline
 * next to each field and are announced; what was typed is kept on error.
 */
export default function ContactForm({ defaultType = "" }: { defaultType?: string }) {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const onSubmit = useFormAction(action);
  const v = state.values ?? {};
  const err = state.errors ?? {};

  if (state.status === "success") {
    return (
      <div role="status" className="rounded border border-ink bg-surface p-8 md:p-10">
        <p className="t-meta text-accent">Inquiry sent</p>
        <p className="t-section mt-4">Thank you.</p>
        <p className="mt-4 max-w-md text-[16px] text-secondary-aa">{state.message}</p>
      </div>
    );
  }

  const field = (name: string) => ({
    id: `f-${name}`,
    name,
    "aria-invalid": err[name] ? true : undefined,
    "aria-describedby": err[name] ? `e-${name}` : undefined,
  });
  const error = (name: string) =>
    err[name] ? (
      <p id={`e-${name}`} className="field-error">
        {err[name]}
      </p>
    ) : null;
  const type = v.projectType ?? ((PROJECT_TYPES as readonly string[]).includes(defaultType) ? defaultType : "");

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
      {/* Honeypot: hidden from people, tempting to bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="f-company">Company</label>
        <input id="f-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="f-name" className="field-label">Full name</label>
        <input {...field("name")} className="field-input" autoComplete="name" defaultValue={v.name} />
        {error("name")}
      </div>
      <div>
        <label htmlFor="f-email" className="field-label">Email address</label>
        <input {...field("email")} type="email" inputMode="email" className="field-input" autoComplete="email" defaultValue={v.email} />
        {error("email")}
      </div>
      <div>
        <label htmlFor="f-projectType" className="field-label">Project type</label>
        <select key={type} {...field("projectType")} className="field-input" defaultValue={type}>
          <option value="" disabled>Choose one</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        {error("projectType")}
      </div>
      <div>
        <label htmlFor="f-budget" className="field-label">Estimated budget</label>
        <select {...field("budget")} className="field-input" defaultValue={v.budget ?? ""}>
          <option value="" disabled>Choose one</option>
          {BUDGETS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        {error("budget")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="f-deadline" className="field-label">Project deadline</label>
        <select {...field("deadline")} className="field-input sm:max-w-[calc(50%-12px)]" defaultValue={v.deadline ?? ""}>
          <option value="" disabled>Choose one</option>
          {DEADLINES.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        {error("deadline")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="f-message" className="field-label">Project description</label>
        <textarea
          {...field("message")}
          rows={6}
          className="field-input resize-y"
          placeholder="What are you making, how much footage is there, and where will it be published?"
          defaultValue={v.message}
        />
        {error("message")}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 sm:col-span-2">
        <button type="submit" className="btn btn-accent w-full sm:w-auto" disabled={pending} aria-busy={pending}>
          {pending ? "Sending…" : "Send inquiry"} {!pending && <span className="arrow" aria-hidden>→</span>}
        </button>
        {state.status === "error" && state.message && (
          <p role="alert" className="text-[14px] text-[#b42318]">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
