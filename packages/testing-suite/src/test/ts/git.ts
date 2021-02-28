import execa from 'execa'
import { resolve } from 'path'

import {
  copyDirectory,
  // gitAdd,
  // gitBranch,
  // gitCheckout,
  gitCommit,
  // gitCommitAll,
  // gitGetConfig,
  // gitGetTagHash,
  // gitGetTags,
  gitInit,
  gitInitOrigin,
  gitInitTestingRepo,
  // gitPush,
  // gitTag,
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
    fit('configures origin', () => {
      const cwd = gitInit({sync})
      copyDirectory(`${fixtures}/basicPackage/`, cwd)
      const commitId = gitCommit({ cwd, message: 'feat: initial commit', sync, all: true})
      const url = gitInitOrigin({cwd, branch: 'release', sync})

      expect(url).toEqual(expect.any(String))
      expect(commitId).toEqual(expect.any(String))
      expect(
        execa.sync('git', ['remote', 'show', 'origin'], { cwd }).stdout,
      ).toMatch(/master\s+tracked\n\s+release\s+tracked/)
    })
  })
  //
  // describe('gitGetConfig()', () => {
  //   it('returns git config value', () => {
  //     const cwd = gitInit({ sync })
  //
  //     expect(gitGetConfig(cwd, 'commit.gpgsign')).toBe('false')
  //   })
  // })
  //
  // describe('gitAdd()', () => {
  //   it('adds file to git', () => {
  //     const cwd = gitInit()
  //     copyDirectory(`${fixtures}/basicPackage/`, cwd)
  //     gitAdd(cwd, 'package.json')
  //     const commitId = gitCommit(cwd, 'chore: add package.json')
  //
  //     expect(commitId).toEqual(expect.any(String))
  //   })
  // })
  //
  // describe('gitPush()', () => {
  //   it('pushes to remote', () => {
  //     const cwd = gitInit()
  //     copyDirectory(`${fixtures}/basicPackage/`, cwd)
  //     gitCommitAll(cwd, 'feat: initial commit')
  //     gitInitOrigin(cwd)
  //
  //     expect(() => gitPush(cwd)).not.toThrowError()
  //   })
  // })
  //
  // describe('gitTag()', () => {
  //   it('adds tag to commit', () => {
  //     const cwd = gitInit({sync: true})
  //     const tag1 = 'foo@1.0.0'
  //     const tag2 = 'bar@1.0.0'
  //     copyDirectory(`${fixtures}/basicPackage/`, cwd)
  //     const commitId = gitCommitAll(cwd, 'feat: initial commit')
  //     gitTag(cwd, tag1, commitId)
  //     gitTag(cwd, tag2, commitId)
  //     gitInitOrigin(cwd)
  //     gitPush(cwd)
  //
  //     const tagHash = gitGetTagHash(cwd, tag1)
  //     const tags = gitGetTags(cwd, commitId)
  //
  //     expect(tagHash).toBe(commitId)
  //     expect(tags).toEqual([tag2, tag1])
  //   })
  // })
  //
  // describe('gitCheckout()', () => {
  //   it('checks out target branch', () => {
  //     const cwd = gitInit()
  //
  //     copyDirectory(`${fixtures}/basicPackage/`, cwd)
  //     gitCommitAll(cwd, 'feat: initial commit')
  //     gitBranch(cwd, 'release')
  //
  //     expect(
  //       execa.sync('git', ['branch', '--show-current'], { cwd }).stdout,
  //     ).toBe('master')
  //
  //     gitCheckout(cwd, 'release')
  //     expect(
  //       execa.sync('git', ['branch', '--show-current'], { cwd }).stdout,
  //     ).toBe('release')
  //   })
  // })
})
