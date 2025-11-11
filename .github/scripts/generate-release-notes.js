const { execSync } = require('child_process');
const fs = require('fs');
const conventionalChangelog = require('conventional-changelog');

const newVersion = process.env.RELEASE_VERSION;
if (!newVersion) {
  console.error('RELEASE_VERSION not set');
  process.exit(1);
}

const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

// Find latest tag before the new one (must be v[semver] format)
let prevTag = '';
try {
  prevTag = execSync('git describe --tags --abbrev=0 HEAD^').toString().trim();
} catch (e) {
  // No previous tag found, maybe first release
}
const newTag = `v${newVersion}`;

const compareUrl = prevTag
  ? `https://github.com/${owner}/${repo}/compare/${prevTag}...${newTag}`
  : null;

// Generate release notes using conventional-changelog (conventionalcommits preset)
let notes = '';
(async () => {
  const changelogStream = conventionalChangelog({
    preset: 'conventionalcommits',
    releaseCount: 1,
    outputUnreleased: false
  }, {
    version: newVersion,
    currentTag: newTag,
    previousTag: prevTag || undefined
  });

  for await (const chunk of changelogStream) {
    notes += chunk.toString();
  }

  // Insert Compare link if relevant
  if (compareUrl) {
    notes += `\n\n[Compare changes](${compareUrl})\n`;
  }
  fs.writeFileSync('RELEASE_NOTES.md', notes.trim(), 'utf8');
  console.log('Release notes written to RELEASE_NOTES.md');
})();