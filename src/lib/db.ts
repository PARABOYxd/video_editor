import "server-only";
import { env } from "./env";
import { seedCategories, seedProfile, seedServices } from "./seed";

/*
 * One tiny query interface over two drivers:
 *
 *  - Production (Vercel): postgres.js against DATABASE_URL (Neon, Supabase,
 *    any Postgres).
 *  - Local development without DATABASE_URL: PGlite, a WASM build of
 *    Postgres that runs in-process and stores data in .data/pglite. Same SQL,
 *    zero setup.
 *
 * During `next build` (parallel workers) and on Vercel without DATABASE_URL
 * there is no database: callers get `null` and serve the seed content
 * read-only.
 */

export type Row = Record<string, unknown>;
export type Db = { query<T extends Row = Row>(text: string, params?: unknown[]): Promise<T[]> };

const SCHEMA = `
create table if not exists settings (
  key text primary key,
  value jsonb not null
);
create table if not exists categories (
  id serial primary key,
  name text not null,
  slug text not null unique,
  sort int not null default 0
);
create table if not exists projects (
  id serial primary key,
  slug text not null unique,
  title text not null,
  category_id int references categories(id) on delete set null,
  client_type text not null default '',
  summary text not null default '',
  description text not null default '',
  duration text not null default '',
  video_url text not null default '',
  thumbnail_url text not null default '',
  year text not null default '',
  featured boolean not null default false,
  published boolean not null default true,
  is_sample boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists services (
  id serial primary key,
  title text not null,
  description text not null default '',
  sort int not null default 0
);
create table if not exists testimonials (
  id serial primary key,
  name text not null,
  role text not null default '',
  quote text not null,
  photo_url text not null default '',
  published boolean not null default true,
  sort int not null default 0
);
-- Added in the editorial redesign. "add column if not exists" makes these
-- safe to run on databases created by the first version.
alter table projects add column if not exists client text not null default '';
alter table projects add column if not exists background text not null default '';
alter table projects add column if not exists objective text not null default '';
alter table projects add column if not exists approach text not null default '';
alter table projects add column if not exists role text not null default '';
alter table projects add column if not exists software jsonb not null default '[]'::jsonb;
alter table projects add column if not exists poster_url text not null default '';
alter table projects add column if not exists aspect_ratio text not null default '16:9';
alter table projects add column if not exists gallery jsonb not null default '[]'::jsonb;
alter table projects add column if not exists seo_title text not null default '';
alter table projects add column if not exists seo_description text not null default '';
alter table projects add column if not exists result text not null default '';
alter table projects add column if not exists captions_url text not null default '';
alter table projects add column if not exists project_type text;
alter table projects add column if not exists footage_source text not null default '';
alter table services add column if not exists deliverables text not null default '';
alter table services add column if not exists ideal_for text not null default '';
alter table services add column if not exists process text not null default '';
create table if not exists inquiries (
  id serial primary key,
  name text not null,
  email text not null,
  project_type text not null default '',
  budget text not null default '',
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table inquiries add column if not exists deadline text not null default '';
alter table inquiries add column if not exists reference_url text not null default '';
`;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function migrateAndSeed(db: Db) {
  for (const stmt of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) {
    await db.query(stmt);
  }

  await db.query("insert into settings (key, value) values ('profile', $1::jsonb) on conflict (key) do nothing", [
    JSON.stringify(seedProfile),
  ]);
  // Rebrand: rename only if the profile still has the old default name (admin edits stay).
  await db.query(
    `update settings set value = value || '{"brandName":"Rytora Studio","shortName":"Rytora Studio"}'::jsonb
     where key = 'profile' and value->>'brandName' = 'Rishab Jain & Kunal Gophane'`
  );
  for (const [i, name] of seedCategories.entries()) {
    await db.query("insert into categories (name, slug, sort) values ($1, $2, $3) on conflict (slug) do nothing", [
      name,
      slugify(name),
      i,
    ]);
  }
  // Earlier boots re-inserted the seed services on every start; drop those exact duplicates.
  await db.query(
    `delete from services s using services d
     where s.id > d.id and s.title = d.title and s.description = d.description`
  );
  // services has no unique column, so "on conflict" can't dedupe. Only seed into an empty table.
  const hasServices = await db.query("select 1 from services limit 1");
  if (!hasServices.length) {
    for (const [i, sv] of seedServices.entries()) {
      await db.query(
        "insert into services (title, description, deliverables, ideal_for, process, sort) values ($1, $2, $3, $4, $5, $6)",
        [sv.title, sv.description, sv.deliverables, sv.idealFor, sv.process, i]
      );
    }
  }
}

async function connect(): Promise<Db | null> {
  if (process.env.NEXT_PHASE === "phase-production-build" && !env.databaseUrl) return null;

  if (env.databaseUrl) {
    const { default: postgres } = await import("postgres");
    const sql = postgres(env.databaseUrl, {
      max: 3,
      idle_timeout: 20,
      // Serverless poolers (Neon / Supabase pgbouncer) don't support prepared statements.
      prepare: false,
    });
    return {
      async query<T extends Row>(text: string, params: unknown[] = []) {
        return (await sql.unsafe(text, params as never[])) as unknown as T[];
      },
    };
  }

  if (env.isVercel) return null;

  // Local development: in-process Postgres.
  const { PGlite } = await import("@electric-sql/pglite");
  const { mkdir } = await import("node:fs/promises");
  const dir = `${process.cwd()}/.data/pglite`;
  await mkdir(dir, { recursive: true }); // PGlite won't create parent folders itself
  const pg = await PGlite.create(dir);
  return {
    async query<T extends Row>(text: string, params: unknown[] = []) {
      const res = await pg.query<T>(text, params);
      return res.rows;
    },
  };
}

const globalForDb = globalThis as unknown as { __veDb?: Promise<Db | null>; __veSchema?: string };

/** The database, migrated and seeded on first use; `null` when there is none. */
export function getDb(): Promise<Db | null> {
  // In dev the connection outlives a hot reload: apply new columns to it.
  if (globalForDb.__veDb && globalForDb.__veSchema !== SCHEMA) {
    globalForDb.__veSchema = SCHEMA;
    globalForDb.__veDb = globalForDb.__veDb.then(async (db) => {
      if (db) await migrateAndSeed(db);
      return db;
    });
  }
  if (!globalForDb.__veDb) {
    globalForDb.__veSchema = SCHEMA;
    globalForDb.__veDb = (async () => {
      const db = await connect();
      if (db) await migrateAndSeed(db);
      return db;
    })().catch((err) => {
      globalForDb.__veDb = undefined;
      globalForDb.__veSchema = undefined;
      throw err;
    });
  }
  return globalForDb.__veDb;
}

/** Like getDb, but throws a readable error when there is no database (for writes). */
export async function requireDb(): Promise<Db> {
  const db = await getDb();
  if (!db) {
    throw new Error("No database is configured. Set DATABASE_URL (see .env.example) to save changes.");
  }
  return db;
}
