module.exports = {
  branches: [
    { name: 'main', prerelease: 'rc' },
    'release'
  ],
  plugins: [
    [
      "@semantic-release/commit-analyzer"
    ],
    [
      "@semantic-release/release-notes-generator"
    ]
  ],
  tagFormat: "v${version}"
};
