module.exports = {
  branch: 'master',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          {type: 'docs', release: 'patch'},
          {type: 'refactor', release: 'patch'},
        ],
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES']
        }
      }
    ],
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'CI=true YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install && git add ../../yarn.lock',
      }
    ],
    '@semrel-extra/npm',
    [
      '@semantic-release/github',
      {
        successComment: false,
        failComment: false
      }
    ],
    [
      '@semantic-release/git',
      {
        message: 'chore(release): ${nextRelease.gitTag} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  ]
}
