import { gitExec, IGitCommon, TGitResult } from './exec'

export interface IGitRemoteAdd extends IGitCommon {
  url: string
  remote?: string
}

export const gitRemoteAdd = <T extends IGitRemoteAdd>({
  cwd,
  sync,
  url,
  remote = 'origin',
}: T): TGitResult<T> => {
  return gitExec({
    cwd,
    sync,
    args: ['remote', 'add', remote, url],
  }) as TGitResult<T>
}

export interface IGitSetRemoteHead extends IGitCommon {
  remote?: string
}

export const gitRemoteSetHead = <T extends IGitSetRemoteHead>({
  cwd,
  sync,
  remote = 'origin',
}: T): TGitResult<T> => {
  return gitExec({
    cwd,
    sync,
    args: ['remote', 'set-head', remote, '--auto'],
  }) as TGitResult<T>
}
