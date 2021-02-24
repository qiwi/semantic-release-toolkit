import { Extends } from '@qiwi/substrate'
import debug, { Debugger } from 'debug'
import execa from 'execa'
import { nanoid } from 'nanoid'

export interface IGitCommon {
  cwd: string
  sync?: boolean
  debug?: Debugger
}

export type TGitResult<T, R = string> = Extends<
  T,
  { sync: true },
  R,
  Promise<R>
>

export interface TGitExecContext extends IGitCommon {
  args?: any[]
}

const defaultDebug = debug('git-exec')

export const gitExec = <T extends TGitExecContext>({
  sync,
  cwd,
  args = [],
  debug: _debug,
}: T): TGitResult<T> => {
  const debug = _debug || defaultDebug

  const execaArgs: [string, readonly string[], execa.SyncOptions] = [
    'git',
    args as string[],
    { cwd },
  ]
  const gitExecId = nanoid()
  const log = <T>(output: T): T => {
    debug(`[${gitExecId}]`, output)
    return output
  }

  log(execaArgs)

  if (sync === true) {
    return (log(execa.sync(...execaArgs).stdout) as unknown) as TGitResult<T>
  }

  return execa(...execaArgs).then(({ stdout }) =>
    log(stdout.toString()),
  ) as TGitResult<T>
}
