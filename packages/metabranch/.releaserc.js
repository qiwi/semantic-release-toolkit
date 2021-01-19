module.exports = {
  debug: true,
  branch: 'master',
  plugins: [
    [
      '@qiwi/semrel-metabranch',
      {
        publish: {
          action: 'push',
          branch: 'docs',
          from: './docs',
          to: '.',
        }
      }
    ],
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    [
      '@semantic-release/github',
      {
        successComment: false,
        failComment: false
      }
    ],
    '@semantic-release/git'
  ]
}
