import { gitExec, IGitCommon, TGitResult } from './exec'

export interface IGitFetch extends IGitCommon {
  remote?: string
  branch?: string
}

export const gitFetchAll = <T extends IGitFetch>({
  cwd,
  sync,
}: T): TGitResult<T['sync']> =>
  gitExec({
    cwd,
    sync: sync as T['sync'],
    args: ['fetch', '--all'],
  })

export const gitFetch = <T extends IGitFetch>({
  cwd,
  remote = 'origin',
  branch,
  sync,
}: T): TGitResult<T['sync']> =>
  branch
    ? gitExec({
        cwd,
        sync: sync as T['sync'],
        args: ['fetch', remote, branch],
      })
    : gitFetchAll({ cwd, sync: sync as T['sync'] })
