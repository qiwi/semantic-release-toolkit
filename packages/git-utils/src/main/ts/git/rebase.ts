import { gitExec, IGitCommon, TGitResult } from './exec'

export interface IGitRebase extends IGitCommon {
  remote?: string
  branch?: string
}

export const gitRebaseToRemote = <T extends IGitRebase>({
  cwd,
  sync,
  remote,
  branch,
}: T): TGitResult<T['sync']> =>
  gitExec({
    cwd,
    sync: sync as T['sync'],
    args: ['rebase', `${remote}/${branch}`],
  })
