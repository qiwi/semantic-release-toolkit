import { ICallable } from '@qiwi/substrate'
import execa from 'execa'
import tempy from 'tempy'

import {
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
  gitShowCommitted,
  gitSetUser,
  gitStatus,
  gitTag,
} from '../../../main/ts'

jest.mock('execa')

describe('git-utils', () => {
  const fakeExec = (..._args: any[]) => ({ stdout: 'output' }) // eslint-disable-line
  const execaAsync = jest.fn(fakeExec)
  const execaSync = jest.fn(fakeExec)

  beforeAll(() => {
    // @ts-ignore
    execa.mockImplementation(async (...args: any[]) => execaAsync(...args))

    // @ts-ignore
    execa.sync.mockImplementation(execaSync)
  })

  afterAll(jest.restoreAllMocks)

  afterEach(jest.clearAllMocks)

  const cwd = tempy.directory()
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
      [['git', ['commit', '--message', 'foo', '--no-gpg-sign'], { cwd }]],
      'output',
    ],
    [
      gitCommit,
      { cwd, message: 'foo', all: true },
      [
        [
          'git',
          ['commit', '--all', '--message', 'foo', '--no-gpg-sign'],
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
      'output'
    ]
  ]

  cases.forEach(([fn, ctx, argsOfArgs, result]) => {
    it(`${fn.name}`, async () => {
      await fn(ctx)
      expect(fn({ ...ctx, sync: true })).toEqual(result)

      argsOfArgs.forEach((args) => {
        expect(execaAsync).toHaveBeenCalledWith(...args)
        expect(execaSync).toHaveBeenCalledWith(...args)
      })
    })
  })
})
