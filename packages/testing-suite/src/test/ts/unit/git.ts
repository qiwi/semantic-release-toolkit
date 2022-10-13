import { dirname,resolve } from 'node:path'
import {fileURLToPath} from 'node:url'

import { execaSync } from 'execa'

import {
  gitClone,
  gitCreateFakeRepo,
  gitGetTags,
  gitPushFakeCommits,
} from '../../../main/ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const fixtures = resolve(__dirname, '../../fixtures')
const sync = true

describe('testing suite', () => {
  describe('gitCreateFakeRepo()', () => {
    it('creates new fake repo', () => {
      const { cwd, url, commits } = gitCreateFakeRepo({
        sync,
        commits: [
          {
            message: 'chore: initial commit',
            from: `${fixtures}/basicPackage/`,
            tag: 'foobar',
            branch: 'foo',
          },
        ],
      })
      expect(cwd).toEqual(expect.any(String))
      expect(
        execaSync('git', ['rev-parse', 'HEAD'], { cwd }).stdout,
      ).toEqual(commits[0])

      const _cwd = gitClone({ sync, url })

      execaSync('git', ['fetch', '--all'], { cwd: _cwd })
      expect(
        execaSync('git', ['rev-parse', 'remotes/origin/foo'], { cwd: _cwd })
          .stdout,
      ).toEqual(commits[0])
      expect(gitGetTags({ cwd, hash: commits[0], sync })).toEqual(['foobar'])
    })
  })
  describe('gitPushFakeCommits()', () => {
    it('adds commit to repo', () => {
      const { cwd, url } = gitCreateFakeRepo({
        sync,
        commits: [],
      })
      const { commits } = gitPushFakeCommits({
        cwd,
        sync,
        commits: [
          {
            message: 'feat: foo bar baz',
            from: `${fixtures}/foo/`,
            branch: 'foo',
          },
          {
            message: 'feat: initial commit',
            from: `${fixtures}/basicPackage/`,
          },
        ],
      })

      const _cwd = gitClone({ sync, url })
      const _commits = execaSync('git', ['log', '-10', '--format=format:%H'], {
          cwd: _cwd,
        })
        .stdout.split('\n')

      expect(commits).toEqual(_commits.reverse())
      expect(
        execaSync('git', ['rev-parse', 'remotes/origin/master'], {
          cwd: _cwd,
        }).stdout,
      ).toEqual(commits[1])
    })
  })
})
