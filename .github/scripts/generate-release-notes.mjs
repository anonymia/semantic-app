import { execSync } from "node:child_process";
import fs from "node:fs";
import conventionalChangelogCore from "conventional-changelog-core";
import preset from "conventional-changelog-conventionalcommits";

const newVersion = process.env.RELEASE_VERSION;
if (!newVersion) {
  console.error("RELEASE_VERSION not set");
  process.exit(1);
}

const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

// Find latest tag before the new one
let prevTag = "";
try {
  prevTag = execSync("git describe --tags --abbrev=0 HEAD^").toString().trim();
} catch (e) {
  // No previous tag found, maybe first release
}
const newTag = `v${newVersion}`;

const compareUrl = prevTag
  ? `https://github.com/${owner}/${repo}/compare/${prevTag}...${newTag}`
  : null;

// preset is an object here!
let notes = "";
const changelogStream = conventionalChangelogCore(
  {
    config: preset,
    releaseCount: 1,
    outputUnreleased: false,
  },
  {
    version: newVersion,
    currentTag: newTag,
    previousTag: prevTag || undefined,
  }
);

for await (const chunk of changelogStream) {
  notes += chunk.toString();
}

// Insert Compare link if relevant
if (compareUrl) {
  notes += `\n\n[Compare changes](${compareUrl})\n`;
}
fs.writeFileSync("RELEASE_NOTES.md", notes.trim(), "utf8");
console.log("Release notes written to RELEASE_NOTES.md");