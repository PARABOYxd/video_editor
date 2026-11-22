import "server-only";
import { DEFAULT_SERVICE, SERVICE_EXTRAS } from "@/config/content";
import { slugify } from "./db";
import type { Service } from "./types";

/** A service from the admin joined with its extras from src/config/content.ts. */
export function serviceDetails(service: Service) {
  const slug = slugify(service.title);
  const extra = SERVICE_EXTRAS[slug] ?? DEFAULT_SERVICE;
  return {
    ...service,
    ...extra,
    slug,
    priceLabel: extra.startingPrice === null ? "Quoted per project" : `Starting from ₹${extra.startingPrice.toLocaleString("en-IN")}`,
    turnaroundLabel: extra.turnaround ?? "Confirmed with your quote",
  };
}

export type ServiceDetails = ReturnType<typeof serviceDetails>;
