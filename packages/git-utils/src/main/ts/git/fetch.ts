import { formatFlags } from '../flags'
import { gitExec, IGitCommon, TGitResult } from './exec'

export interface IGitFetch extends IGitCommon {
  remote?: string
  branch?: string
  depth?: number
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
  depth,
}: T): TGitResult<T['sync']> => {
  const flags = formatFlags({ depth })

  return branch
    ? gitExec({
      cwd,
      sync: sync as T['sync'],
      args: ['fetch', ...flags, remote, branch],
    })
    : gitFetchAll({cwd, sync: sync as T['sync']})
}
