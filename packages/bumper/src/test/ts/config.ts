import { resolve } from 'path'

import {
  readPackagesNamesFromGlobs,
  resolveBumperRules,
  resolvePackageNames,
  resolveBumperDirectives, TBumperConfig,
} from '../../main/ts'

const fixtures = resolve(__dirname, '../fixtures')

describe('bumper/config', () => {
  describe('readPackagesNamesFromGlobs()', () => {
    it('extracts name from package.json files', () => {
      expect(readPackagesNamesFromGlobs([
        'packages/*',
        'more-packages/*',
        '!*/qux',
    ], resolve(fixtures, 'basicMonorepo'))).toEqual([
        'pkg-bar',
        'pkg-foo',
        'pkg-baz',
      ])
    })
  })

  describe('resolvePackageNames()', () => {
    it('reads pkg names from globs', () => {
      expect(resolvePackageNames([
        'packages/*',
        'more-packages/*',
        '@qiwi/some-pkg'
      ], resolve(fixtures, 'basicMonorepo'))).toEqual([
        '@qiwi/some-pkg',
        'pkg-bar',
        'pkg-foo',
        'pkg-baz',
        'pkg-qux',
      ])

      expect(resolvePackageNames('packages/*', resolve(fixtures, 'basicMonorepo'))).toEqual([
        'pkg-bar',
        'pkg-foo',
      ])
    })
  })

  describe('resolveBumperRules()', () => {
    it('turns bumper config into bumper rules', () => {
      expect(resolveBumperRules([
        {
          include: 'packages/*',
          deps: [{
            type: 'prod',
            release: 'patch',
            include: ['packages/*'],
            strategy: 'override'
          }]
        },
        {
          include: 'more-packages/*',
          deps: [{
            type: ['dev', 'peer'],
            release: 'inherit',
            include: ['packages/*'],
            strategy: 'override'
          }]
        }
      ], resolve(fixtures, 'basicMonorepo'))).toMatchSnapshot()
    })
  })

  describe('resolveBumperDirectives()', () => {
    fit('resolves bumperConfig and actual pkg deps as bumper directives', () => {
      const cwd = resolve(fixtures, 'basicMonorepo')
      const bumperConfig: TBumperConfig = [
        {
          include: 'packages/*',
          deps: [{
            type: 'prod',
            release: 'patch',
            include: ['packages/*'],
            strategy: 'override'
          }]
        },
        {
          include: 'more-packages/*',
          deps: [{
            type: ['dev', 'peer'],
            release: 'inherit',
            include: ['packages/*'],
            strategy: 'override'
          }]
        }
      ]

      expect(resolveBumperDirectives(bumperConfig, ['packages/*', 'more-packages/*'], cwd)).toEqual({})
    })
  })
})
