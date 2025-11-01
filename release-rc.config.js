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
          // Add this to read "type:" from the beginning of *any* line:
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
          revertPattern: /^revert:\s([\s\S]*)$/i,
          revertCorrespondence: ["header"],
          // This helps scan multiline
          fieldPattern: /^(\w+):\s(.+)$/gm
        },
        releaseRules: [
          {type: "breaking", release: "major"},
          {type: "feat", release: "minor"},
          {type: "fix", release: "patch"}
        ],
        parserOpts: {
          // this configuration match "type:" at the start of any line
          // Useful for multiline PR bodies
          headerPattern: /^(\w+)(\(.+\))?!?: (.+)$/,
          headerCorrespondence: ["type", "scope", "subject"],
          referenceActions: null,
          mergePattern: null,
          mergeCorrespondence: null,
          fieldPattern: /^(\w+):\s(.+)$/gm
        }
      }
    ],
    // No publish/release plugins here!
  ],
  tagFormat: "v${version}-rc.${prerelease}",
  // Don't generate release notes or changelogs, don't publish npm/github releases
  generateNotes: false,
  prepare: false,
  publish: false,
  success: false,
  fail: false,
};
