import debug, { Debugger } from 'debug'
import execa from 'execa'
import { nanoid } from 'nanoid'

import { SyncGuard, ISyncSensitive, TSyncDirective } from '../ifaces'

export interface IGitCommon extends ISyncSensitive {
  cwd: string
  debug?: Debugger
}

export type TGitResult<S extends TSyncDirective, V extends any = string> = SyncGuard<V, S>

export interface TGitExecContext extends IGitCommon {
  args?: any[]
}

const defaultDebug = debug('git-exec')

export const gitExec = <T extends TGitExecContext>(opts: T): TGitResult<T['sync']> => {
  const debug = opts.debug || defaultDebug
  const {
    cwd,
    args = [],
    sync
  } = opts

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
    return (log(execa.sync(...execaArgs).stdout) as unknown) as TGitResult<typeof opts['sync'], R>
  }

  return execa(...execaArgs).then(({ stdout }) =>
    log(stdout.toString()),
  ) as unknown as TGitResult<typeof opts['sync'], R>
}
