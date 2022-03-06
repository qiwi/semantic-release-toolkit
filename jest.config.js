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
  projects: projects.map(name => `<rootDir>/packages/${name}/`),
}
