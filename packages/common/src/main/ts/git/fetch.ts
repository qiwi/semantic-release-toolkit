import { gitExec, IGitCommon, TGitResult } from './exec'

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
    args: ['fetch', '--all'],
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
      args: ['fetch', remote, branch],
    }) as TGitResult<T>
  }

  return gitFetchAll({ cwd, sync }) as TGitResult<T>
}
