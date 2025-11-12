const prereleaseBranch = process.env.PRERELEASE_BRANCH || 'main';
const releaseBranch = process.env.RELEASE_BRANCH || 'release';

module.exports = {
  branches: [
    { name: prereleaseBranch, prerelease: 'rc' },
    releaseBranch
  ],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        "preset": "conventionalcommits"
      }
    ],
    // No publish/release plugins here!
  ],
  tagFormat: "v${version}",
  // Don't generate release notes or changelogs
  generateNotes: false
};
