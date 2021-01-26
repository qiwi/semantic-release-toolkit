import path from 'path'
import tempy from 'tempy'

import {
  gitFindUp,
  gitInit,
} from '../../main/ts/git'

const root = path.resolve(__dirname, '../../../../../')

describe('git-utils', () => {
  describe('gitFindUp()', () => {
    it('returns the closest .git containing path', async () => {
      expect(await gitFindUp(__filename)).toBe(root)
    })
  })

  describe('gitInit()', () => {
    const isGitDir = async (cwd: string): Promise<boolean> => await gitFindUp(cwd) === cwd

    it('inits a new git project in temp dir', async () => {
      const cwd = await gitInit()

      expect(cwd).toEqual(expect.any(String))
      expect(cwd).not.toBe(root)
      expect(await isGitDir(cwd)).toBe(true)
    })

    it('inits repo in specified dir', async () => {
      const cwd = tempy.directory()
      const _cwd = await gitInit(cwd)

      expect(cwd).toBe(_cwd)
      expect(await isGitDir(cwd)).toBe(true)
    })

    it('asserts that cwd does not belong to git repo', async () => {
      expect(gitInit(__dirname)).rejects.toThrowError(`${__dirname} belongs to repo ${root} already`)
    })
  })
})
