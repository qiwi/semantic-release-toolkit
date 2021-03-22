import {
  copyDirectory,
  gitAdd,
  gitCommit,
  gitCommitAll,
  gitGetTagHash,
  gitGetTags,
  gitInitOrigin,
  gitInitTestingRepo,
  gitPush,
  gitTag,
} from '@qiwi/semrel-testing-suite'
import execa from 'execa'
import fs from 'fs-extra'
import path, { resolve } from 'path'
import tempy from 'tempy'

import {
  gitCheckout,
  gitConfigAdd,
  gitConfigGet,
  gitExec,
  gitInit,
  gitRoot,
} from '../../../main/ts'

const root = path.resolve(__dirname, '../../../../../../')
const fixtures = resolve(__dirname, '../../fixtures')

describe('git-utils', () => {
  describe('gitRoot()', () => {
    it('returns the closest .git containing path', async () => {
      expect(await gitRoot(__filename)).toBe(root)
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

        expect(await gitRoot(temp0)).toBe(temp1)
      })

      it('returns undefined if `gitdir: ref` is unreachable', async () => {
        const temp = tempy.directory()
        const data = `gitdir: /foo/bar/baz.git `

        await fs.outputFile(path.join(temp, '.git'), data, { encoding: 'utf8' })

        expect(await gitRoot(temp)).toBeUndefined()
      })

      it('returns undefined if `gitdir: ref` is invalid', async () => {
        const temp = tempy.directory()
        const data = `gitdir: broken-ref-format`

        await fs.outputFile(path.join(temp, '.git'), data, { encoding: 'utf8' })

        expect(await gitRoot(temp)).toBeUndefined()
      })
    })

    it('returns undefined if `.git` is not found', async () => {
      expect(await gitRoot(tempy.root)).toBeUndefined()
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
      (await gitRoot(cwd)) === cwd

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

      await fs.writeFile(path.resolve(cwd, 'test.txt'), 'test', {
        encoding: 'utf-8',
      })

      await gitExec({ cwd, args: ['add', '.'] })
      await gitExec({ cwd, args: ['commit', '-a', '-m', 'initial'] })

      await gitCheckout({ cwd, b: true, branch: 'foobar' })

      const branches = await gitExec({ cwd, args: ['branch', '-a'] })

      expect(branches.includes('foobar')).toBeTruthy()
    })
  })

  describe('gitInitOrigin()', () => {
    it('configures origin', () => {
      const sync = true
      const cwd = gitInitTestingRepo({ sync })
      copyDirectory(`${fixtures}/basicPackage/`, cwd)
      const commitId = gitCommitAll({
        cwd,
        message: 'feat: initial commit',
        sync,
      })
      const url = gitInitOrigin({ cwd, branch: 'release', sync })

      expect(url).toEqual(expect.any(String))
      expect(commitId).toEqual(expect.any(String))
      expect(
        execa.sync('git', ['remote', 'show', 'origin'], { cwd }).stdout,
      ).toMatch(/Remote branch:\n\s+release\s+tracked/)
      // ).toMatch(/master\s+tracked\n\s+release\s+tracked/)
    })
  })

  describe('gitAdd()', () => {
    it('adds files to git', () => {
      const sync = true
      const cwd = gitInitTestingRepo({ sync })
      copyDirectory(`${fixtures}/basicPackage/`, cwd)
      gitAdd({ cwd, sync, file: 'package.json' })
      const commitId = gitCommit({
        cwd,
        message: 'chore: add package.json',
        sync,
      })

      expect(commitId).toEqual(expect.any(String))
    })
  })

  describe('gitPush()', () => {
    it('pushes to remote', () => {
      const sync = true
      const cwd = gitInitTestingRepo({ sync })
      copyDirectory(`${fixtures}/basicPackage/`, cwd)
      gitCommitAll({ cwd, message: 'feat: initial commit', sync })
      gitInitOrigin({ cwd, sync }) // TODO insert to gitInitTestingRepo

      expect(() => gitPush({ cwd, sync })).not.toThrowError()
    })
  })

  describe('gitTag()', () => {
    it('adds tag to commit', () => {
      const sync = true
      const cwd = gitInitTestingRepo({ sync })
      const tag1 = 'foo@1.0.0'
      const tag2 = 'bar@1.0.0'
      copyDirectory(`${fixtures}/basicPackage/`, cwd)
      const commitId = gitCommitAll({
        cwd,
        message: 'feat: initial commit',
        sync,
      })

      gitTag({ cwd, tag: tag1, hash: commitId, sync })
      gitTag({ cwd, tag: tag2, hash: commitId, sync })
      gitInitOrigin({ cwd, sync })
      gitPush({ cwd, sync })

      const tagHash = gitGetTagHash({ cwd, tag: tag1, sync })
      const tags = gitGetTags({ cwd, hash: commitId, sync })

      expect(tagHash).toBe(commitId)
      expect(tags).toEqual([tag2, tag1])
    })
  })
})
