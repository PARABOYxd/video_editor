"use client";

import { useActionState } from "react";
import { login, type FormState } from "../actions";
import { FormMessage, Submit } from "@/components/admin/ui";
import { useFormAction } from "@/components/useFormAction";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, { status: "idle" } as FormState);
  const onSubmit = useFormAction(action);
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="field-label">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field-input" />
      </div>
      <div>
        <label htmlFor="password" className="field-label">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field-input" />
      </div>
      <FormMessage state={state} />
      <Submit pending={pending} pendingText="Signing in…" className="w-full">Sign in</Submit>
    </form>
  );
}
