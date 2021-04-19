import { resolve } from 'path'

import {
  readPackagesNamesFromGlobs,
  resolvePackageNames,
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
})
