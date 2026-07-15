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
    ? path.join(process.cwd(), "node_modules", ".bin", "oxfmt.ps1")
    : path.join(process.cwd(), "node_modules", ".bin", "oxfmt");

const modeArg = checkMode ? "--check" : "--write";
const chunkSize = process.platform === "win32" ? 40 : files.length;

for (let index = 0; index < files.length; index += chunkSize) {
  const args = [modeArg, ...files.slice(index, index + chunkSize)];
  if (process.platform === "win32") {
    execFileSync(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", oxfmtBin, ...args],
      { stdio: "inherit" }
    );
  } else {
    execFileSync(oxfmtBin, args, { stdio: "inherit" });
  }
}
