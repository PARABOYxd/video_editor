"use client";

import { startTransition, type FormEvent } from "react";

/**
 * React 19 resets a form after a `<form action={…}>` submission completes,
 * which wipes what the user typed whenever validation fails. Submitting
 * through onSubmit + startTransition runs the same server action without
 * that reset, so input survives errors.
 */
export function useFormAction(dispatch: (fd: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
}
