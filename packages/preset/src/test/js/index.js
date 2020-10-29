describe('@qiwi/semrel-preset', () => {
  const plugins = [
    '@qiwi/semantic-release-gh-pages-plugin',
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/github',
    '@semantic-release/git'
  ]

  plugins.forEach((plugin) => {
    it(`contains ${plugin}`, () => {
      expect(require(plugin)).not.toBeUndefined()
    })
  })
})
