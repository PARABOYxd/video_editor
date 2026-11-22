"use client";

import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { submitInquiry, type InquiryState } from "@/app/actions/inquiry";
import { BUDGETS, INQUIRY_FIELDS, INQUIRY_TYPES, readInquiry, todayInIndia, validateInquiry, type InquiryErrors, type InquiryField } from "@/lib/inquiry";
import { useFormAction } from "../useFormAction";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const initial: InquiryState = { status: "idle" };
const noSubscribe = () => () => {};

/**
 * Checked in the browser with the same rules as the server action. Errors sit
 * next to their field, clear as you fix them, and what you typed is kept.
 */
export default function ContactForm({ defaultType = "" }: { defaultType?: string }) {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  // null: show whatever the server said.
  const [local, setLocal] = useState<InquiryErrors | null>(null);
  const send = useFormAction(action);
  const form = useRef<HTMLFormElement>(null);
  const done = useRef<HTMLHeadingElement>(null);
  // Only after hydration: a statically cached "today" would go stale.
  const today = useSyncExternalStore(noSubscribe, todayInIndia, () => "");

  const v: Partial<Record<InquiryField, string>> = state.values ?? {};
  const err: InquiryErrors = local ?? state.errors ?? {};
  const type = v.projectType || ((INQUIRY_TYPES as readonly string[]).includes(defaultType) ? defaultType : "");

  const focusFirst = (errors: InquiryErrors) => {
    const name = INQUIRY_FIELDS.find((field) => errors[field]);
    if (name) form.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
  };

  useEffect(() => {
    if (state.status === "success") done.current?.focus();
    else if (state.errors) focusFirst(state.errors);
  }, [state]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    const errors = validateInquiry(readInquiry(new FormData(e.currentTarget)));
    if (Object.keys(errors).length) {
      setLocal(errors);
      focusFirst(errors);
      return;
    }
    setLocal(null);
    send(e);
  };

  const onChange = (e: React.FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name as InquiryField;
    if (!err[name]) return;
    const fresh = validateInquiry(readInquiry(new FormData(e.currentTarget)));
    setLocal({ ...err, [name]: fresh[name] });
  };

  if (state.status === "success") {
    return (
      <Card role="status" variant="strong" padding="lg">
        <p className="t-meta text-accent">Inquiry sent</p>
        <h2 ref={done} tabIndex={-1} className="t-h2 mt-4 outline-none">
          Thank you.
        </h2>
        <p className="mt-4 max-w-md text-body text-secondary">{state.message}</p>
      </Card>
    );
  }

  const field = (name: InquiryField, required = true) => ({
    id: `f-${name}`,
    name,
    required,
    "aria-invalid": err[name] ? true : undefined,
    "aria-describedby": err[name] ? `e-${name}` : undefined,
  });
  const error = (name: InquiryField) =>
    err[name] ? (
      <p id={`e-${name}`} role="alert" className="field-error">
        {err[name]}
      </p>
    ) : null;
  const optional = <span className="font-normal text-secondary">(optional)</span>;

  return (
    <form ref={form} onSubmit={onSubmit} onChange={onChange} noValidate data-hide-fab className="grid gap-6 sm:grid-cols-2">
      {/* Honeypot: hidden from people, tempting to bots. Not named like anything autofill knows. */}
      <div aria-hidden className="sr-only">
        <label htmlFor="f-extra">Leave this field empty</label>
        <input id="f-extra" name="contact_extra" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="f-name" className="field-label">Full name</label>
        <input {...field("name")} className="field-input" autoComplete="name" maxLength={100} defaultValue={v.name} />
        {error("name")}
      </div>
      <div>
        <label htmlFor="f-email" className="field-label">Email address</label>
        <input {...field("email")} type="email" inputMode="email" className="field-input" autoComplete="email" maxLength={200} defaultValue={v.email} />
        {error("email")}
      </div>
      <div>
        <label htmlFor="f-projectType" className="field-label">Project type</label>
        <select key={type} {...field("projectType")} className="field-input" defaultValue={type}>
          <option value="" disabled>Choose one</option>
          {INQUIRY_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        {error("projectType")}
      </div>
      <div>
        <label htmlFor="f-budget" className="field-label">Budget range</label>
        <select {...field("budget")} className="field-input" defaultValue={v.budget ?? ""}>
          <option value="" disabled>Choose one</option>
          {BUDGETS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        {error("budget")}
      </div>
      <div className="min-w-0">
        <label htmlFor="f-deadline" className="field-label">Deadline {optional}</label>
        <input {...field("deadline", false)} type="date" min={today || undefined} className="field-input min-w-0 appearance-none" defaultValue={v.deadline} />
        {error("deadline")}
      </div>
      <div className="min-w-0">
        <label htmlFor="f-reference" className="field-label">Reference link {optional}</label>
        <input {...field("reference", false)} type="url" inputMode="url" maxLength={500} placeholder="https://" className="field-input" defaultValue={v.reference} />
        {error("reference")}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="f-message" className="field-label">Message</label>
        <textarea
          {...field("message")}
          rows={6}
          maxLength={4000}
          className="field-input resize-y"
          placeholder="What are you making, how much footage is there, and where will it be published?"
          defaultValue={v.message}
        />
        {error("message")}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 sm:col-span-2">
        <Button type="submit" variant="accent" arrow loading={pending} loadingText="Sending…" className="w-full sm:w-auto">
          Send inquiry
        </Button>
        {!pending && state.status === "error" && state.message && !local && (
          <p role="alert" data-form-error className="text-small text-danger">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
