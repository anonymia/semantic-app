const releaseBranch = process.env.RELEASE_BRANCH || 'release';

module.exports = {
  branches: [releaseBranch],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        "preset": "conventionalcommits"
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        "preset": "conventionalcommits"
      }
    ]
  ],
  tagFormat: "v${version}"
};
