import execa from 'execa'

import {
  gitInit,
  gitCheckout,
  gitConfigAdd,
  gitConfigGet,
  gitAddRemote,
  gitFetchAll,
  gitFetch,
} from '../../../main/ts'
import tempy from 'tempy'
import { ICallable } from '@qiwi/substrate'

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

  afterAll(jest.clearAllMocks)

  const cwd = tempy.directory()
  const cases: [ICallable, Record<any, any>, any[], any?][] = [
    [gitInit, { cwd }, ['git', ['init'], { cwd }], cwd],
    [
      gitCheckout,
      { cwd, b: true, branch: 'foobar' },
      ['git', ['checkout', '-b', 'foobar'], { cwd }],
      'output',
    ],
    [
      gitConfigAdd,
      { cwd, key: 'user.name', value: 'Foo Bar' },
      ['git', ['config', '--add', 'user.name', 'Foo Bar'], { cwd }],
      'output',
    ],
    [
      gitConfigGet,
      { cwd, key: 'user.name' },
      ['git', ['config', 'user.name'], { cwd }],
      'output',
    ],
    [
      gitAddRemote,
      { cwd, remote: 'qiwi', url: 'git@gh.com:qiwi/foo.git' },
      ['git', ['remote', 'add', 'qiwi', 'git@gh.com:qiwi/foo.git'], { cwd }],
      'output',
    ],
    [gitFetchAll, { cwd }, ['git', ['fetch', '--all'], { cwd }], 'output'],
    [
      gitFetch,
      { cwd, origin: 'qiwi', branch: 'master' },
      ['git', ['fetch', 'origin', 'master'], { cwd }],
      'output',
    ],
    [
      gitFetch,
      { cwd },
      ['git', ['fetch', '--all'], { cwd }],
      'output',
    ],
  ]

  cases.forEach(([fn, ctx, args, result]) => {
    it(`${fn.name}`, async () => {
      await fn(ctx)
      expect(fn({ ...ctx, sync: true })).toBe(result)

      expect(execaAsync).toHaveBeenCalledWith(...args)
      expect(execaSync).toHaveBeenCalledWith(...args)
    })
  })
})
