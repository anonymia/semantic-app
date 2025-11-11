module.exports = {
  branches: ['release'],
  plugins: [
    [
      "@semantic-release/commit-analyzer"
    ],
    [
      "@semantic-release/release-notes-generator"
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
