import execa from 'execa'
import { resolve } from 'path'
// import resolveFrom, { silent as resolveFromSilent } from 'resolve-from'
// import semanticRelease from 'semantic-release'

// import { readdirSync } from 'fs'

import {
  gitCommit,
  gitCommitAll,
  gitInit,
  gitInitOrigin,
  gitGetConfig,
  gitPush,
  gitAdd,
  gitTag,
  gitGetTagHash,
  gitGetTags,
  gitCheckout,
  gitBranch,
  // cleanPath,
  copyDirectory,
} from '../../main/ts'

const fixtures = resolve(__dirname, '../fixtures')

describe('testing suite', () => {
  describe('gitInit()', () => {
    it('creates temp git dir, and returns its path', () => {
      const branch = 'foobarbaz'
      const cwd = gitInit(branch)

      expect(execa.sync('git', ['branch', '--show-current'], {cwd}).stdout).toBe(branch)
      expect(cwd).toEqual(expect.any(String))
    })
  })

  describe('gitInitOrigin()', () => {
    it('configures origin', () => {
      const cwd = gitInit()
      copyDirectory(`${fixtures}/basicPackage/`, cwd)
      const commitId = gitCommitAll(cwd, 'feat: initial commit')
      const url = gitInitOrigin(cwd, 'release')

      expect(url).toEqual(expect.any(String))
      expect(commitId).toEqual(expect.any(String))
      expect(execa.sync('git', ['remote', 'show', 'origin'], {cwd}).stdout)
        .toMatch(/master\s+tracked\n\s+release\s+tracked/)
    })
  })

  describe('gitGetConfig()', () => {
    it('returns git config value', () => {
      const cwd = gitInit()

      expect(gitGetConfig(cwd, 'commit.gpgsign')).toBe('false')
    })
  })

  describe('gitAdd()', () => {
    it('adds file to git', () => {
      const cwd = gitInit()
      copyDirectory(`${fixtures}/basicPackage/`, cwd)
      gitAdd(cwd, 'package.json')
      const commitId = gitCommit(cwd, 'chore: add package.json')

      expect(commitId).toEqual(expect.any(String))
    })
  })

  describe('gitPush()', () => {
    it('pushes to remote', () => {
      const cwd = gitInit()
      copyDirectory(`${fixtures}/basicPackage/`, cwd)
      gitCommitAll(cwd, 'feat: initial commit')
      gitInitOrigin(cwd)

      expect(() => gitPush(cwd)).not.toThrowError()
    })
  })

  describe('gitTag()', () => {
    it('adds tag to commit', () => {
      const cwd = gitInit()
      const tag1 = 'foo@1.0.0'
      const tag2 = 'bar@1.0.0'
      copyDirectory(`${fixtures}/basicPackage/`, cwd)
      const commitId = gitCommitAll(cwd, 'feat: initial commit')
      gitTag(cwd, tag1, commitId)
      gitTag(cwd, tag2, commitId)
      gitInitOrigin(cwd)
      gitPush(cwd)

      const tagHash = gitGetTagHash(cwd, tag1)
      const tags = gitGetTags(cwd, commitId)

      expect(tagHash).toBe(commitId)
      expect(tags).toEqual([tag2, tag1])
    })
  })

  describe('gitCheckout()', () => {
    it('checks out target branch', () => {
      const cwd = gitInit()

      copyDirectory(`${fixtures}/basicPackage/`, cwd)
      gitCommitAll(cwd, 'feat: initial commit')
      gitBranch(cwd, 'release')

      expect(execa.sync('git', ['branch', '--show-current'], {cwd}).stdout).toBe('master')

      gitCheckout(cwd, 'release')
      expect(execa.sync('git', ['branch', '--show-current'], {cwd}).stdout).toBe('release')
    })
  })
})
