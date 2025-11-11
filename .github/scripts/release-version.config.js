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
