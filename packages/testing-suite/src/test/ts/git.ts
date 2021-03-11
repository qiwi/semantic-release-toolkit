import execa from 'execa'
import { resolve } from 'path'

import {
  copyDirectory,
  gitAdd,
  gitBranch,
  gitCheckout,
  gitCommit,
  gitCommitAll,
  // gitCommitAll,
  gitConfigGet,
  gitGetTagHash,
  gitGetTags,
  // gitInit,
  gitInitOrigin,
  gitInitTestingRepo,
  gitPush,
  gitTag,
} from '../../main/ts'

const fixtures = resolve(__dirname, '../fixtures')
const sync = true

describe('testing suite', () => {
  describe('gitInit()', () => {
    it('creates temp git dir, and returns its path', () => {
      const branch = 'foobarbaz'
      const cwd = gitInitTestingRepo({ branch, sync })

      expect(
        execa.sync('git', ['branch', '--show-current'], { cwd }).stdout,
      ).toBe(branch)
      expect(cwd).toEqual(expect.any(String))
    })
  })

  describe('gitInitOrigin()', () => {
    it('configures origin', () => {
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

  describe('gitGetConfig()', () => {
    it('returns git config value', () => {
      const cwd = gitInitTestingRepo({ sync })

      expect(gitConfigGet({ cwd, key: 'commit.gpgsign', sync: true })).toBe(
        'false',
      )
    })
  })

  describe('gitAdd()', () => {
    it('adds file to git', () => {
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
      const cwd = gitInitTestingRepo({ sync })
      copyDirectory(`${fixtures}/basicPackage/`, cwd)
      gitCommitAll({ cwd, message: 'feat: initial commit', sync })
      gitInitOrigin({ cwd, sync }) // TODO insert to gitInitTestingRepo

      expect(() => gitPush({ cwd, sync })).not.toThrowError()
    })
  })

  describe('gitTag()', () => {
    it('adds tag to commit', () => {
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

  describe('gitCheckout()', () => {
    it('checks out target branch', async () => {
      const cwd = await gitInitTestingRepo({})

      copyDirectory(`${fixtures}/basicPackage/`, cwd)
      await gitCommitAll({ cwd, message: 'feat: initial commit' })
      await gitBranch({ cwd, branch: 'release' })

      expect(
        execa.sync('git', ['branch', '--show-current'], { cwd }).stdout,
      ).toBe('master')

      await gitCheckout({ cwd, branch: 'release' })
      expect(
        execa.sync('git', ['branch', '--show-current'], { cwd }).stdout,
      ).toBe('release')
    })
  })
})
