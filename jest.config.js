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
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': '@swissquote/crafty-preset-jest/src/esm-transformer'
  },
  transformIgnorePatterns: [
    '<rootDir>/../../node_modules/(?!read-pkg-up8/.*)',
    '<rootDir>/node_modules/(?!read-pkg-up8/.*)'
  ],
  projects: projects.map(name => `<rootDir>/packages/${name}/jest.config.js`),
}
