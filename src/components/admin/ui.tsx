"use client";

import type { FormState } from "@/app/admin/actions";
import Button from "@/components/ui/Button";

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
    <Button type="submit" size="sm" loading={pending} loadingText={pendingText} className={className}>
      {children}
    </Button>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p role={state.status === "error" ? "alert" : "status"} className={`text-small ${state.status === "error" ? "text-danger" : "text-success"}`}>
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
      {hint && !error && <p className="mt-1.5 text-caption text-secondary">{hint}</p>}
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
      <button type="submit" className="min-h-10 rounded px-3 text-small text-danger hover:bg-danger/10">
        {label}
      </button>
    </form>
  );
}
