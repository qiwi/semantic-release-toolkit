// https://github.com/facebook/jest/pull/11818/files#diff-7a98537bdfc98f8a0321f1e556bc226e1eb013e30c266962a788c77df4289a61R181
import { jest } from '@jest/globals'
import { ICallable } from '@qiwi/substrate'
import { temporaryDirectory } from 'tempy'

const fakeExec = (..._args: any[]) => ({ stdout: 'output' }) // eslint-disable-line
const execa = jest.fn(() => Promise.resolve(fakeExec()))
const execaSync = jest.fn(fakeExec)

jest.unstable_mockModule('execa', () => ({
  __esModule: true,
  execa,
  execaSync
}))

const {
  gitAdd,
  gitAddAll,
  gitBranch,
  gitCheckout,
  gitCommit,
  gitConfigAdd,
  gitConfigGet,
  gitFetch,
  gitFetchAll,
  gitGetHead,
  gitGetTagHash,
  gitGetTags,
  gitInit,
  gitInitOrigin,
  gitInitRemote,
  gitPush,
  gitPushRebase,
  gitRebaseToRemote,
  gitRemoteAdd,
  gitRemoteSetHead,
  gitSetUser,
  gitShowCommitted,
  gitStatus,
  gitTag,
} = await import('../../../main/ts')

describe('git-utils', () => {
  afterAll(jest.restoreAllMocks)
  afterEach(jest.clearAllMocks)

  const cwd = temporaryDirectory()
  const cases: [ICallable, Record<any, any>, any[][], any?][] = [
    [gitInit, { cwd }, [['git', ['init'], { cwd }]], cwd],
    [
      gitInitRemote,
      { cwd },
      [['git', ['init', '--bare'], { cwd }]],
      expect.any(String),
    ],
    [
      gitInitOrigin,
      { cwd, branch: 'foo' },
      [['git', ['push', '--tags', 'origin', 'HEAD:refs/heads/foo'], { cwd }]],
      expect.any(String),
    ],
    [
      gitCheckout,
      { cwd, b: true, branch: 'foobar' },
      [['git', ['checkout', '-b', 'foobar'], { cwd }]],
      'output',
    ],
    [
      gitConfigAdd,
      { cwd, key: 'user.name', value: 'Foo Bar' },
      [['git', ['config', '--add', 'user.name', 'Foo Bar'], { cwd }]],
      'output',
    ],
    [
      gitConfigGet,
      { cwd, key: 'user.name' },
      [['git', ['config', 'user.name'], { cwd }]],
      'output',
    ],
    [
      gitRemoteAdd,
      { cwd, remote: 'qiwi', url: 'git@gh.com:qiwi/foo.git' },
      [['git', ['remote', 'add', 'qiwi', 'git@gh.com:qiwi/foo.git'], { cwd }]],
      'output',
    ],
    [gitFetchAll, { cwd }, [['git', ['fetch', '--all'], { cwd }]], 'output'],
    [
      gitFetch,
      { cwd, origin: 'qiwi', branch: 'master' },
      [['git', ['fetch', 'origin', 'master'], { cwd }]],
      'output',
    ],
    [gitFetch, { cwd }, [['git', ['fetch', '--all'], { cwd }]], 'output'],
    [
      gitRemoteSetHead,
      { cwd, remote: 'qiwi' },
      [['git', ['remote', 'set-head', 'qiwi', '--auto'], { cwd }]],
      'output',
    ],
    [
      gitAdd,
      { cwd, file: 'qiwi*' },
      [['git', ['add', 'qiwi*'], { cwd }]],
      'output',
    ],
    [gitAddAll, { cwd }, [['git', ['add', '--all'], { cwd }]], 'output'],
    [gitTag, { cwd, tag: 'foo' }, [['git', ['tag', 'foo'], { cwd }]], 'output'],
    [
      gitTag,
      { cwd, tag: 'foo', hash: 'bar' },
      [['git', ['tag', '-f', 'foo', 'bar'], { cwd }]],
      'output',
    ],
    [
      gitGetTags,
      { cwd, hash: 'bar' },
      [['git', ['tag', '--merged', 'bar'], { cwd }]],
      ['output'],
    ],
    [
      gitGetTagHash,
      { cwd, tag: 'foo' },
      [['git', ['rev-list', '-1', 'foo'], { cwd }]],
      'output',
    ],
    [
      gitBranch,
      { cwd, branch: 'foo' },
      [['git', ['branch', 'foo'], { cwd }]],
      'output',
    ],
    [gitGetHead, { cwd }, [['git', ['rev-parse', 'HEAD'], { cwd }]], 'output'],
    [
      gitCommit,
      { cwd, message: 'foo' },
      [['git', ['commit', '--message', 'foo', '--no-gpg-sign', '--allow-empty'], { cwd }]],
      'output',
    ],
    [
      gitCommit,
      { cwd, message: 'foo', all: true },
      [
        [
          'git',
          ['commit', '--all', '--message', 'foo', '--no-gpg-sign', '--allow-empty'],
          { cwd },
        ],
      ],
      'output',
    ],
    [
      gitPush,
      { cwd, branch: 'metabranch', remote: 'qiwi' },
      [
        [
          'git',
          ['push', '--tags', 'qiwi', 'HEAD:refs/heads/metabranch'],
          { cwd },
        ],
      ],
      'output',
    ],
    [
      gitRebaseToRemote,
      { cwd, branch: 'metabranch', remote: 'qiwi' },
      [['git', ['rebase', 'qiwi/metabranch'], { cwd }]],
      'output',
    ],
    [
      gitPushRebase,
      { cwd, branch: 'metabranch', remote: 'qiwi' },
      [
        ['git', ['fetch', 'qiwi', 'metabranch'], { cwd }],
        ['git', ['rebase', 'qiwi/metabranch'], { cwd }],
        [
          'git',
          ['push', '--tags', 'qiwi', 'HEAD:refs/heads/metabranch'],
          { cwd },
        ],
        ['git', ['rev-parse', 'HEAD'], { cwd }],
      ],
      'output',
    ],
    [gitStatus, { cwd }, [['git', ['status', '--short'], { cwd }]], 'output'],
    [
      gitShowCommitted,
      { cwd, hash: 'foo' },
      [
        [
          'git',
          ['diff-tree', '--no-commit-id', '--name-only', '-r', 'foo'],
          { cwd },
        ],
      ],
      ['output'],
    ],
    [
      gitSetUser,
      { cwd, name: 'Foo Bar', email: 'foo@bar.com' },
      [
        ['git', ['config', '--add', 'user.name', 'Foo Bar'], { cwd }],
        ['git', ['config', '--add', 'user.email', 'foo@bar.com'], { cwd }],
      ],
      'output',
    ],
  ]

  cases.forEach(([fn, ctx, argsOfArgs, result]) => {
    it(`${fn.name}`, async () => {
      await fn(ctx)
      expect(fn({ ...ctx, sync: true })).toEqual(result)

      argsOfArgs.forEach((args) => {
        expect(execa).toHaveBeenCalledWith(...args)
        expect(execaSync).toHaveBeenCalledWith(...args)
      })
    })
  })
})
