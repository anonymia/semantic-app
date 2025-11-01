module.exports = {
  branches: ['main'],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        parserOpts: {
          headerPattern: /^(\w+)(\(.+\))?!?: (.+)$/,
          headerCorrespondence: ["type", "scope", "subject"],
          // parse "type:" at line start, e.g. in PR body multiline
          fieldPattern: /^(\w+):\s(.+)$/gm
        },
        releaseRules: [
          {type: "breaking", release: "major"},
          {type: "feat", release: "minor"},
          {type: "fix", release: "patch"}
        ]
      }
    ],
    [
      "@semantic-release/release-notes-generator"
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd: "make build VERSION=${nextRelease.version} BUILD_DATE=$(date -Iseconds) && make package VERSION=${nextRelease.version} BUILD_DATE=$(date -Iseconds)",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: [
          "*.tar.gz"
        ]
      }
    ]
  ],
  tagFormat: "v${version}"
};
