import { execSync } from "node:child_process";

const allowed = new Set([".env.example"]);
const forbiddenExact = new Set([".env"]);
const forbiddenExtensions = [".pem", ".key", ".pfx", ".sql", ".dump", ".bak", ".sqlite", ".sqlite3"];

const files = execSync("git ls-files", { encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean);

const violations = files.filter((file) => {
  const name = file.split(/[\\/]/).pop() ?? file;
  if (allowed.has(name)) return false;
  if (forbiddenExact.has(name)) return true;
  return forbiddenExtensions.some((extension) => name.endsWith(extension));
});

if (violations.length > 0) {
  console.error("Sensitive or private artifacts must not be committed:");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log("No forbidden sensitive file artifacts are tracked.");
