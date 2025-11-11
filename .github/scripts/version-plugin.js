module.exports = {
  // Called by semantic-release before analyzing commits
  // We hijack this to set the nextRelease object forcibly
  analyzeCommits: async (pluginConfig, context) => {
    const version = process.env.RELEASE_VERSION;
    if (!version) {
      context.logger.error('No RELEASE_VERSION provided!');
      return null; // No release
    }
    // Perform "major"/"minor"/"patch" as required, here we always return "major" to "force release"
    return 'major';
  },
  // Overwrite generateNotes just so conventional-changelog still works
  generateNotes: async (pluginConfig, context) => undefined,
  // Called after determining version; just set it to what was passed in
  prepare: async (pluginConfig, context) => {
    context.nextRelease.version = process.env.RELEASE_VERSION;
  },
};