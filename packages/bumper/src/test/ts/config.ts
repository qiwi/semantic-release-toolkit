import { readPackagesNamesFromGlobs } from '../../main/ts'
import { resolve } from 'path'

const fixtures = resolve(__dirname, '../fixtures')

describe('bumper/config', () => {
  describe('readPackagesNamesFromGlobs', () => {
    it('extracts name from package.json files', () => {
      expect(readPackagesNamesFromGlobs([
        "packages/*",
        "more-packages/*"
    ], resolve(fixtures, 'basicMonorepo'))).toEqual([
        'pkg-bar',
        'pkg-foo',
        'pkg-baz',
      ])
    })
  })
})
