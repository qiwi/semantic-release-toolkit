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
}: T): TGitResult<T> =>
  gitExec({
    cwd,
    sync,
    args: ['rebase', `${remote}/${branch}`],
  }) as TGitResult<T>
