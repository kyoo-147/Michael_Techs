import fs from "node:fs";
import path from "node:path";

const sourceDir = path.resolve("dist/pagefind");
const targetDir = path.resolve("public/pagefind");

if (!fs.existsSync(sourceDir)) {
  console.error(`Pagefind output not found at ${sourceDir}`);
  process.exit(1);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

console.log(`Synced Pagefind assets to ${targetDir}`);
