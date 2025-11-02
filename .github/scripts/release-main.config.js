module.exports = {
  branches: ['release'],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        parserOpts: {
          headerPattern: /^\s*\*?\s*(\w+)(\(.+\))?!?: (.+)$/,
          headerCorrespondence: ["type", "scope", "subject"],
          mergePattern: /^(?!\w+(?:\(.+\))?!?: ).+ \(#(\d+)\)$/,
          mergeCorrespondence: ['id'],
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
          revertPattern: /^revert:\s([\s\S]*)$/i,
          revertCorrespondence: ["header"],
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
        prepareCmd: "make build VERSION=${nextRelease.gitTag} && make package",
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
