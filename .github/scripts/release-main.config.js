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
        prepareCmd: 'if [ ! -z "${nextRelease.version}" ]; then echo "${nextRelease.version}" > version.txt; else echo "No release version"; echo "" > version.txt; fi',
      },
    ]
  ],
  tagFormat: "v${version}"
};
