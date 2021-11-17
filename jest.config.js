const projects = [
  'config',
  'config-monorepo',
  'preset',
  'plugin-creator',
  'plugin-actions',
  'testing-suite',
  'common',
  'metabranch'
]

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/**/src/main/**/*.(j|t)s'
  ],
  testFailureExitCode: 1,
  projects: projects.map(name => `<rootDir>/packages/${name}/`),
}
