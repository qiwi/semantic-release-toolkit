import { Extends } from '@qiwi/substrate'
import debug, { Debugger } from 'debug'
import execa from 'execa'
import { nanoid } from 'nanoid'

export interface ISyncSensitive {
  sync?: boolean
}

export interface IGitCommon extends ISyncSensitive {
  cwd: string
  debug?: Debugger
}

export type SyncGuard<V, S extends (boolean | undefined)> = Extends<S, true, Extends<V, Promise<any>, never, V>, Extends<V, Promise<any>, V, Promise<V>>>

export type TGitResult<T extends ISyncSensitive, R = string> = SyncGuard<R, T['sync']>

// export type TGitResult<T, R = string> = Extends<
//   T,
//   { sync: true },
//   R,
//   Extends<R, Promise<any>, R, Promise<R>>
// >

export interface TGitExecContext extends IGitCommon {
  args?: any[]
}

const defaultDebug = debug('git-exec')

export const gitExec = <T extends TGitExecContext, R>({
  sync,
  cwd,
  args = [],
  debug: _debug,
}: T): TGitResult<T, R> => {
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
    return (log(execa.sync(...execaArgs).stdout) as unknown) as TGitResult<T, R>
  }

  return execa(...execaArgs).then(({ stdout }) =>
    log(stdout.toString()),
  )  as unknown as TGitResult<T, R>
}
