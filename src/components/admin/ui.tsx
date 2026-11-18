"use client";

import type { FormState } from "@/app/admin/actions";

export function Submit({
  children,
  pending,
  pendingText = "Saving…",
  className = "",
}: {
  children: React.ReactNode;
  pending: boolean;
  pendingText?: string;
  className?: string;
}) {
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={`btn btn-primary !min-h-11 ${className}`}>
      {pending ? pendingText : children}
    </button>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p role={state.status === "error" ? "alert" : "status"} className={`text-[14px] ${state.status === "error" ? "text-[#b42318]" : "text-emerald-700"}`}>
      {state.message}
    </p>
  );
}

/** Field with label, hint and inline error. */
export function Field({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[12.5px] text-secondary-aa">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

/** A delete button that asks first. Works with a server action passed as `action`. */
export function DeleteButton({ action, id, label = "Delete", confirmText }: { action: (fd: FormData) => Promise<void>; id: number; label?: string; confirmText: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="min-h-10 rounded px-3 text-[14px] text-[#b42318] hover:bg-[#b42318]/10">
        {label}
      </button>
    </form>
  );
}
