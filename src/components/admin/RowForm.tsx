"use client";

import { useActionState, useEffect, useRef } from "react";
import type { FormState } from "@/app/admin/actions";
import { FormMessage, Submit } from "./ui";
import { useFormAction } from "../useFormAction";

export type RowField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "checkbox" | "url" | "file";
  value?: string | number | boolean;
  wide?: boolean;
  hint?: string;
};

/**
 * One editable row (category / service / testimonial). Renders its fields,
 * saves through the given server action and shows inline errors.
 */
export default function RowForm({
  action,
  id,
  fields,
  submitLabel = "Save",
  resetOnSuccess = false,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  id?: number;
  fields: RowField[];
  submitLabel?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" } as FormState);
  const onSubmit = useFormAction(formAction);
  const e = state.errors ?? {};
  const formRef = useRef<HTMLFormElement>(null);

  // "Add" forms clear themselves after a successful save.
  useEffect(() => {
    if (resetOnSuccess && state.status === "success") formRef.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-6">
      {id && <input type="hidden" name="id" value={id} />}
      {fields.map((f) => {
        const fid = `${f.name}-${id ?? "new"}`;
        const span = f.wide ? "sm:col-span-6" : f.type === "number" || f.type === "checkbox" ? "sm:col-span-1" : "sm:col-span-3";
        if (f.type === "checkbox") {
          return (
            <label key={f.name} className={`${span} flex items-center gap-2 pt-7 text-[14px]`}>
              <input type="checkbox" name={f.name} defaultChecked={Boolean(f.value)} className="h-4 w-4" /> {f.label}
            </label>
          );
        }
        return (
          <div key={f.name} className={span}>
            <label htmlFor={fid} className="field-label">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea id={fid} name={f.name} rows={3} defaultValue={String(f.value ?? "")} className="field-input" aria-invalid={!!e[f.name]} />
            ) : f.type === "file" ? (
              <input id={fid} name={f.name} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="field-input" />
            ) : (
              <input
                id={fid}
                name={f.name}
                type={f.type ?? "text"}
                min={f.type === "number" ? 0 : undefined}
                defaultValue={f.value === undefined ? "" : String(f.value)}
                className="field-input"
                aria-invalid={!!e[f.name]}
              />
            )}
            {f.hint && !e[f.name] && <p className="mt-1.5 text-[12.5px] text-secondary-aa">{f.hint}</p>}
            {e[f.name] && <p className="field-error">{e[f.name]}</p>}
          </div>
        );
      })}
      <div className="flex flex-wrap items-center gap-3 sm:col-span-6">
        <Submit pending={pending}>{submitLabel}</Submit>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
