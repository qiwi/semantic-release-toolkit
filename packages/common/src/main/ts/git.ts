import execa from 'execa'
import findUp, { Match } from 'find-up'
import fs from 'fs'
import { Extends } from '@qiwi/substrate'
import { nanoid } from 'nanoid'
import path from 'path'
import tempy from 'tempy'
import { formatFlags } from './flags'
import debug from 'debug'
import { effect } from './misc'

// import { check } from 'blork'

import { Debugger } from '@qiwi/semrel-plugin-creator'

export interface IGitCommon {
  cwd: string
  sync?: boolean
  debug?: Debugger
}

export interface TGitExecContext extends IGitCommon {
  cmd: string
  args?: any[]
}

export interface IGitConfigAdd extends IGitCommon {
  key: string
  value: any
}

export interface IGitConfigGet extends IGitCommon {
  key: string
}

export interface IGitInit {
  cwd?: string
  sync?: boolean
}

export interface IGitCheckout extends IGitCommon {
  branch: string
  b?: boolean
  f?: boolean
}

export interface IGitAddRemote extends IGitCommon {
  url: string
  remote?: string
}

export type TGitResult<T, R = string> = Extends<
  T,
  { sync: true },
  R,
  Promise<R>
>

const defaultDebug = debug('git-exec')

export const gitExec = <T extends TGitExecContext>(
  context: T,
): TGitResult<T> => {
  const { sync, cmd, cwd, args = [], debug: _debug } = context
  const debug = _debug || defaultDebug
  const execaArgs: [string, string[], any] = ['git', [cmd, ...args], { cwd }]
  const gitExecId = nanoid()
  const log = <T>(output: T): T => {
    debug(`[${gitExecId}]`, output)
    return output
  }

  log(execaArgs)

  if (sync === true) {
    return log(execa.sync(...execaArgs).stdout.toString()) as TGitResult<T>
  }

  return execa(...execaArgs).then(({ stdout }) =>
    log(stdout.toString()),
  ) as TGitResult<T>
}

export const gitFindUp = <S>(
  cwd?: string,
  sync?: S,
): Extends<S, boolean, Match, Promise<Match>> => {
  const exec = sync ? findUp.sync : findUp

  return exec(
    (directory) => {
      const gitDir = path.join(directory, '.git')

      return effect(exec.exists(gitDir), (exists) => {
        if (!exists) {
          return
        }

        const isDirectory = fs.lstatSync(gitDir).isDirectory()
        if (isDirectory) {
          return directory
        }

        const gitRef = fs.readFileSync(gitDir, { encoding: 'utf-8' })
        const match = /^gitdir: (.*)\.git\s*$/.exec(gitRef)

        return match ? match[1] : undefined
      })
    },
    { type: 'directory', cwd },
  ) as Extends<S, boolean, Match, Promise<Match>>
}

/**
 * Add a Git config setting.
 *
 * @param {string} cwd The CWD of the Git repository.
 * @param {string} name Config name.
 * @param {any} value Config value.
 * @returns {Promise<void>} Promise that resolves when done.
 */
export const gitConfigAdd = <T extends IGitConfigAdd>({
  cwd,
  key,
  value,
  sync,
}: T): TGitResult<T> => {
  // check(cwd, 'cwd: absolute')
  // check(name, 'name: string+')

  return gitExec({
    cwd,
    sync,
    cmd: 'config',
    args: ['--add', key, value],
  }) as TGitResult<T>
}

export const gitConfig = gitConfigAdd

/**
 * Get a Git config setting.
 *
 * @param {string} cwd The CWD of the Git repository.
 * @param {string} name Config name.
 * @returns {Promise<void>} Promise that resolves when done.
 */
export const gitConfigGet = <T extends IGitConfigGet>({
  cwd,
  key,
  sync,
}: T): TGitResult<T> => {
  // check(cwd, 'cwd: absolute')
  // check(name, 'name: string+')

  return gitExec({
    cwd,
    sync,
    cmd: 'config',
    args: [key],
  }) as TGitResult<T>
}

export const gitInit = <T extends IGitInit>({
  cwd = tempy.directory(),
  sync,
}: T): TGitResult<T> =>
  effect(gitFindUp(cwd, sync), (parentGitDir) => {
    if (parentGitDir) {
      throw new Error(
        `${cwd} belongs to repo ${parentGitDir as string} already`,
      )
    }

    return effect(
      gitExec({
        cwd,
        sync,
        cmd: 'init',
      }),
      () => cwd,
    )
  }) as TGitResult<T>

/*if (branch) {
    await execa('git', ['checkout', '-b', branch], { cwd })
  }

  // Disable GPG signing for commits.
  await gitConfig({cwd, key: 'commit.gpgsign', value: false})*/

// Return directory.
// return cwd

export const gitCheckout = <T extends IGitCheckout>({
  cwd,
  sync,
  branch,
  b,
  f = !b,
}: T): TGitResult<T> => {
  const flags = formatFlags({ b, f })

  return gitExec({
    cwd,
    sync,
    cmd: 'checkout',
    args: [...flags, branch],
  }) as TGitResult<T>
}

export const gitAddRemote = <T extends IGitAddRemote>({
  cwd,
  sync,
  url,
  remote = 'origin',
}: T): TGitResult<T> => {
  return gitExec({
    cwd,
    sync,
    cmd: 'remote',
    args: ['add', remote, url],
  }) as TGitResult<T>
}

export interface IGitFetch extends IGitCommon {
  remote?: string
  branch?: string
}

export const gitFetchAll = <T extends IGitFetch>({
  cwd,
  sync,
}: T): TGitResult<T> => {
  return gitExec({
    cwd,
    sync,
    cmd: 'fetch',
    args: ['--all'],
  }) as TGitResult<T>
}

export const gitFetch = <T extends IGitFetch>({
  cwd,
  remote = 'origin',
  branch,
  sync,
}: T): TGitResult<T> => {
  if (branch) {
    return gitExec({
      cwd,
      sync,
      cmd: 'fetch',
      args: [remote, branch],
    }) as TGitResult<T>
  }

  return gitFetchAll({ cwd, sync }) as TGitResult<T>
}

export const gitSetRemoteHead = async (
  cwd: string,
  remote = 'origin',
): Promise<void> => {
  await execa('git', ['remote', 'set-head', remote, '--auto'], { cwd })
}

export const gitAdd = async (cwd: string, file = '.'): Promise<void> => {
  // Check params.
  // check(cwd, 'cwd: absolute')

  await execa('git', ['add', file], { cwd })
}

export const gitAddAll = async (cwd: string): Promise<void> => {
  // Check params.
  // check(cwd, 'cwd: absolute')

  await execa('git', ['add', '--all'], { cwd })
}

/**
 * Get the current HEAD SHA in a local Git repository.
 *
 * @param {string} cwd The CWD of the Git repository.
 * @return {Promise<string>} Promise that resolves to the SHA of the head commit.
 */
export const gitGetHead = async (cwd: string): Promise<string> => {
  // Check params.
  // check(cwd, 'cwd: absolute')

  // Await command and return HEAD SHA.
  return (await execa('git', ['rev-parse', 'HEAD'], { cwd })).stdout
}

export const gitCommit = async (
  cwd: string,
  message: string,
): Promise<string> => {
  // Check params.
  // check(cwd, 'cwd: absolute')
  // check(message, 'message: string+')

  // Await the command.
  await execa('git', ['commit', '-m', message, '--no-gpg-sign'], { cwd })

  // Return HEAD SHA.
  return gitGetHead(cwd)
}

export const gitPush = async (
  cwd: string,
  remote = 'origin',
  branch = 'master',
): Promise<string> => {
  // Check params.
  // check(cwd, 'cwd: absolute')
  // check(remote, 'remote: string')
  // check(branch, 'branch: lower')

  // Await command.
  await execa('git', ['push', '--tags', remote, `HEAD:refs/heads/${branch}`], {
    cwd,
  })

  return (await execa('git', ['rev-parse', 'HEAD'], { cwd })).stdout
}

export const gitRebaseToRemote = async (
  cwd: string,
  remote = 'origin',
  branch = 'master',
): Promise<void> => {
  await execa('git', ['rebase', `${remote}/${branch}`], { cwd })
}

/*export const gitPushRebase = async (
  cwd: string,
  remote = 'origin',
  branch = 'master',
): Promise<string> => {
  let retries = 5

  while (retries > 0) {
    try {
      try {
        await gitFetch(cwd, remote, branch)
        await gitRebaseToRemote(cwd, remote, branch)
      } catch (e) {
        console.warn('rebase failed', e)
      }

      return await gitPush(cwd, remote, branch)
    } catch (e) {
      retries -= 1
      console.warn('push failed', 'retries left', retries, e)
    }
  }

  return ''
}*/

export const gitShowCommitted = async (
  cwd: string,
  hash = 'HEAD',
): Promise<string[]> => {
  return (
    await execa(
      'git',
      ['diff-tree', '--no-commit-id', '--name-only', '-r', hash],
      { cwd },
    )
  ).stdout.split('\n')
}

export const gitStatus = async (cwd: string): Promise<string> => {
  // Check params.
  // check(cwd, 'cwd: absolute')

  // Run command.
  return (await execa('git', ['status', '--short'], { cwd })).stdout
}
