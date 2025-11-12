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
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd: 'echo "${nextRelease.version}" > version.txt && echo "${nextRelease.notes}" > release-notes.md',
      },
    ]
  ],
  tagFormat: "v${version}"
};
