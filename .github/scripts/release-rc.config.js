module.exports = {
  branches: [
    { name: 'main', prerelease: 'rc' },
    'release'
  ],
  plugins: [
    [
      "@semantic-release/commit-analyzer"
    ],
    // No publish/release plugins here!
  ],
  tagFormat: "v${version}",
  // Don't generate release notes or changelogs, don't publish npm/github releases
  generateNotes: false,
  prepare: false,
  publish: false,
  success: false,
  fail: false,
};
