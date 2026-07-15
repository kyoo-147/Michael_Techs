import { execFileSync } from "node:child_process";
import path from "node:path";

const checkMode = process.argv.includes("--check");
const patterns = ["*.js", "*.mjs", "*.cjs", "*.ts", "*.tsx", "*.json"];

const stdout = execFileSync("git", ["ls-files", ...patterns], {
  encoding: "utf8",
});

const files = stdout
  .split(/\r?\n/)
  .map(file => file.trim())
  .filter(Boolean);

if (files.length === 0) {
  process.exit(0);
}

const oxfmtBin =
  process.platform === "win32"
    ? path.join(process.cwd(), "node_modules", ".bin", "oxfmt.cmd")
    : path.join(process.cwd(), "node_modules", ".bin", "oxfmt");

const args = [checkMode ? "--check" : "--write", ...files];

execFileSync(oxfmtBin, args, { stdio: "inherit" });
