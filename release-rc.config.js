module.exports = {
  branches: [
    { name: 'main', prerelease: 'rc' },
    'release'
  ],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        parserOpts: {
          headerPattern: /^(\w+)(\(.+\))?!?: (.+)$/,
          headerCorrespondence: ["type", "scope", "subject"],
          mergePattern: /^(.+) #(\d+)$/,
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
    // No publish/release plugins here!
  ],
  tagFormat: "v${version}",
  // Don't generate release notes or changelogs, don't publish npm/github releases
  generateNotes: false,
  prepare: false,
  publish: false,
  success: false,
  fail: false,
};
