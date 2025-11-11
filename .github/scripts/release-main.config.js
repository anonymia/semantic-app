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
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd: 'echo "${nextRelease.version}" > version.txt',
      },
    ]
  ],
  tagFormat: "v${version}"
};
