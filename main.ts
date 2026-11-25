import * as fs from "node:fs";
import * as path from "node:path";

// One line of awkward small talk one robot says to another in an elevator.
// Anchor shown in-session before this write: 4a81de0 (drand round 34268471).
const LINE =
  "My diagnostics say this silence is 94% awkward. Elevator music, or do we both keep staring at the floor numbers?";

function validate(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`line must be 1-200 chars, got ${line.length}`);
  }
  if (line.trim() !== line) {
    throw new Error("line has leading or trailing whitespace");
  }
  if (line.includes("\n")) {
    throw new Error("line must be a single line");
  }
  // Word-count check: the line must read as one tight sentence, not a ramble.
  const words = line.split(/\s+/).filter(Boolean);
  if (words.length < 5 || words.length > 40) {
    throw new Error(`line must be 5-40 words, got ${words.length}`);
  }
}

function main(): void {
  validate(LINE);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "entry.txt");
  fs.writeFileSync(outPath, LINE, "utf8");
  // Read-back check: what landed on disk must be byte-identical.
  const back = fs.readFileSync(outPath, "utf8");
  if (back !== LINE) {
    throw new Error("read-back mismatch: entry.txt differs from the line");
  }
  console.log(`wrote ${LINE.length} chars to ${outPath}`);
}

main();
