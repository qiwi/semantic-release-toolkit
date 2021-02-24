import { effect } from '../misc'
import { gitGetHead } from './etc'
import { gitExec, IGitCommon, TGitResult } from './exec'
import { gitFetch } from './fetch'
import { gitRebaseToRemote } from './rebase'

export interface IGitPush extends IGitCommon {
  branch?: string
  remote?: string
}

export const gitPush = <T extends IGitPush>({
  cwd,
  sync,
  branch,
  remote = 'origin',
}: T): TGitResult<T> => {
  // check(cwd, 'cwd: absolute')
  // check(remote, 'remote: string')
  // check(branch, 'branch: lower')

  const args = branch
    ? ['push', '--tags', remote, `HEAD:refs/heads/${branch}`]
    : ['push', '--all', remote]

  return effect(
    gitExec({
      cwd,
      sync,
      args,
    }),
    // Return HEAD SHA.
    () => gitGetHead({ cwd, sync }),
  ) as TGitResult<T>
}

export const gitPushRebase = <T extends IGitPush>({
  cwd,
  sync,
  branch,
  remote = 'origin',
}: T): TGitResult<T> =>
  (sync
    ? gitPushRebaseSync({ cwd, sync, branch, remote })
    : gitPushRebaseAsync({ cwd, sync, branch, remote })) as TGitResult<T>

export const gitPushRebaseAsync = async <T extends IGitPush>({
  cwd,
  sync,
  branch,
  remote = 'origin',
}: T): Promise<string> => {
  let retries = 5

  while (retries > 0) {
    try {
      try {
        await gitFetch({ cwd, sync, branch, remote })
        await gitRebaseToRemote({ cwd, sync, branch, remote })
      } catch (e) {
        console.warn('rebase failed', e)
      }

      return await gitPush({ cwd, sync, branch, remote })
    } catch (e) {
      retries -= 1
      console.warn('push failed', 'retries left', retries, e)
    }
  }

  throw new Error('`gitPushRebase` failed')
}

export const gitPushRebaseSync = <T extends IGitPush>({
  cwd,
  sync,
  branch,
  remote = 'origin',
}: T): TGitResult<T> => {
  let retries = 5

  while (retries > 0) {
    try {
      try {
        gitFetch({ cwd, sync, branch, remote })
        gitRebaseToRemote({ cwd, sync, branch, remote })
      } catch (e) {
        console.warn('rebase failed', e)
      }

      return gitPush({ cwd, sync, branch, remote }) as TGitResult<T>
    } catch (e) {
      retries -= 1
      console.warn('push failed', 'retries left', retries, e)
    }
  }

  throw new Error('`gitPushRebase` failed')
}
