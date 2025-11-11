module.exports = {
  branches: [
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
