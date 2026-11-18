// Generates the admin credentials for .env.local / Vercel env vars.
//   pnpm admin:hash "your-password"
// Prints ADMIN_PASSWORD_HASH (scrypt) and a fresh SESSION_SECRET.
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error('Usage: pnpm admin:hash "a-password-of-10+-characters"');
  process.exit(1);
}
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("hex")}:${hash.toString("hex")}`);
console.log(`SESSION_SECRET=${randomBytes(32).toString("base64url")}`);
