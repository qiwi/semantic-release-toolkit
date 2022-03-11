const PROJECT = process.env.JEST_PROJECT
const projects = [
  'common',
  'config',
  'config-monorepo',
  'git-utils',
  'metabranch',
  'preset',
  'plugin-creator',
  'plugin-actions',
  'testing-suite'
]

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/**/src/main/**/*.(j|t)s'
  ],
  testFailureExitCode: 1,
  projects: (PROJECT ? [PROJECT] : projects).map(name => `<rootDir>/packages/${name}/`),
}
