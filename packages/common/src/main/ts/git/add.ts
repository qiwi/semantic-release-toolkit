import { gitExec, IGitCommon, TGitResult } from './exec'

export interface IGitAdd extends IGitCommon {
  file?: string
}

export const gitAdd = <T extends IGitAdd>({
  cwd,
  sync,
  file = '.',
}: T): TGitResult<T> =>
  gitExec({
    cwd,
    sync,
    args: ['add', file],
  }) as TGitResult<T>

export const gitAddAll = <T extends IGitAdd>({ cwd, sync }: T): TGitResult<T> =>
  gitExec({
    cwd,
    sync,
    args: ['add', '--all'],
  }) as TGitResult<T>
