import fs from 'fs-extra'
import path from 'path'
import tempy from 'tempy'

import {
  gitCheckout,
  gitConfigAdd,
  gitConfigGet,
  gitExec,
  gitFindUp,
  gitInit,
} from '../../../main/ts'

const root = path.resolve(__dirname, '../../../../../../')

describe('git-utils', () => {
  describe('gitFindUp()', () => {
    it('returns the closest .git containing path', async () => {
      expect(await gitFindUp(__filename)).toBe(root)
    })

    // https://git-scm.com/docs/gitrepository-layout
    describe('gitdir ref', () => {
      it('handles `gitdir: ref` and returns target path if exists', async () => {
        const temp0 = tempy.directory()
        const temp1 = tempy.directory()
        const data = `gitdir: ${temp1}.git `

        await fs.outputFile(path.join(temp0, '.git'), data, {
          encoding: 'utf8',
        })

        expect(await gitFindUp(temp0)).toBe(temp1)
      })

      it('returns undefined if `gitdir: ref` is unreachable', async () => {
        const temp = tempy.directory()
        const data = `gitdir: /foo/bar/baz.git `

        await fs.outputFile(path.join(temp, '.git'), data, { encoding: 'utf8' })

        expect(await gitFindUp(temp)).toBeUndefined()
      })

      it('returns undefined if `gitdir: ref` is invalid', async () => {
        const temp = tempy.directory()
        const data = `gitdir: broken-ref-format`

        await fs.outputFile(path.join(temp, '.git'), data, { encoding: 'utf8' })

        expect(await gitFindUp(temp)).toBeUndefined()
      })
    })

    it('returns undefined if `.git` is not found', async () => {
      expect(await gitFindUp(tempy.root)).toBeUndefined()
    })
  })

  describe('gitConfigAdd() / gitConfigGet()', () => {
    it('sets git config value', async () => {
      const key = 'user.name'
      const value = 'Foo Bar'
      const cwd = await gitInit({})

      await gitConfigAdd({ cwd, key, value })

      expect(await gitConfigGet({ cwd, key })).toBe(value)
    })
  })

  describe('gitInit()', () => {
    const isGitDir = async (cwd: string): Promise<boolean> =>
      (await gitFindUp(cwd)) === cwd

    it('inits a new git project in temp dir', async () => {
      const cwd = await gitInit({})

      expect(cwd).toEqual(expect.any(String))
      expect(cwd).not.toBe(root)
      expect(await isGitDir(cwd)).toBe(true)
    })

    it('inits repo in specified dir', async () => {
      const cwd = tempy.directory()
      const _cwd = await gitInit({ cwd })

      expect(cwd).toBe(_cwd)
      expect(await isGitDir(cwd)).toBe(true)
    })

    it('asserts that cwd does not belong to git repo', async () => {
      expect(gitInit({ cwd: __dirname })).rejects.toThrowError(
        `${__dirname} belongs to repo ${root} already`,
      )
    })
  })

  describe('gitCheckout()', () => {
    it('checkout -b creates a branch', async () => {
      const cwd = await gitInit({ cwd: tempy.directory() })

      await fs.writeFile(path.resolve(cwd, 'test.txt'), 'test', {encoding: 'utf-8'})

      await gitExec({ cwd, args: ['add', '.'] })
      await gitExec({ cwd, args: ['commit', '-a', '-m', 'initial'] })

      await gitCheckout({ cwd, b: true, branch: 'foobar' })

      const branches = await gitExec({ cwd, args: ['branch', '-a'] })

      expect(branches.includes('foobar')).toBeTruthy()
    })
  })
})
