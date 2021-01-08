import {gitFindUp} from '../../main/ts/git'
import path from 'path'

describe('git-utils', () => {
  describe('gitFindUp()', () => {
    it('returns the closest .git containing path', async () => {
      expect(await gitFindUp(__filename)).toBe(path.resolve(__dirname, '../../../../../'))
    })
  })
})
