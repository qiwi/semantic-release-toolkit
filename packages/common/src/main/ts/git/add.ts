import { gitExec, IGitCommon, TGitResult } from './exec'

export interface IGitAdd extends IGitCommon {
  file?: string
}

export const gitAdd = <T extends IGitAdd>({
  cwd,
  sync,
  file = '.',
}: T): TGitResult<T['sync']> =>
  gitExec({
    cwd,
    sync: sync as T['sync'],
    args: ['add', file],
  })

export const gitAddAll = <T extends IGitAdd>({ cwd, sync }: T): TGitResult<T['sync']> =>
  gitExec({
    cwd,
    sync: sync as T['sync'],
    args: ['add', '--all'],
  })
