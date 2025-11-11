import { execSync } from "node:child_process";
import fs from "node:fs";
import conventionalChangelogCore from "conventional-changelog-core";
import preset from "conventional-changelog-conventionalcommits";

const newVersion = process.env.RELEASE_VERSION;
if (!newVersion) {
  console.error("RELEASE_VERSION not set");
  process.exit(1);
}

const repoName = process.env.GITHUB_REPOSITORY;
if (!repoName) {
  console.error("GITHUB_REPOSITORY not set");
  process.exit(1);
}
const [owner, repo] = repoName.split("/");

// Find latest annotated tag (previous release)
let prevTag = "";
try {
  prevTag = execSync('gh release view --json tagName -q .tagName').toString().trim();
} catch {
  // No previous tag found, probably first release
}

const newTag = `v${newVersion}`;

// Create new tag at HEAD and overwrite remote if exists
// try {
//   execSync(`git tag -d ${newTag}`, { stdio: "ignore" });
// } catch {}
// execSync(`git tag ${newTag}`);

// try {
//   const remoteTags = execSync("git ls-remote --tags origin").toString();
//   if (remoteTags.includes(`refs/tags/${newTag}`)) {
//     execSync(`git push --delete origin ${newTag}`);
//   }
//   execSync(`git push origin ${newTag}`);
// } catch (e) {
//   console.error(`Failed to push tag ${newTag}:`, e);
//   process.exit(1);
// }

console.log(`Previous tag: ${prevTag ? prevTag : ""}`);
console.log(`New tag: ${newTag}`);
// console.log(execSync(`git log --oneline ${prevTag}..${newTag}`).toString());
// console.log(execSync(`npx conventional-changelog -p conventionalcommits --from=${prevTag} --to=${newTag} --first-parent`).toString());
console.log(execSync(`npx conventional-changelog -p conventionalcommits --from=${prevTag}`).toString());

// Generate release notes with conventional-changelog-core
let notes = "";
const changelogStream = conventionalChangelogCore(
  {
    config: preset,
    releaseCount: 1,
    outputUnreleased: false,
  },
  {
    version: newVersion,
    // currentTag: newTag,
    previousTag: prevTag || undefined,
  }
);

for await (const chunk of changelogStream) {
  notes += chunk.toString();
}

fs.writeFileSync("RELEASE_NOTES.md", notes.trim(), "utf8");
console.log("Release notes written to RELEASE_NOTES.md");