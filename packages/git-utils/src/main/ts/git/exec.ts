import debug, { Debugger } from 'debug'
import { execa, execaSync, SyncOptions } from 'execa'
import { nanoid } from 'nanoid'

import { ISyncSensitive, SyncGuard } from '../ifaces'

export interface IGitCommon extends ISyncSensitive {
  cwd: string
  debug?: Debugger
}

export type TGitResult<
  S extends boolean | undefined,
  V = string
> = SyncGuard<V, S>

export interface TGitExecContext extends IGitCommon {
  args?: any[]
}

const defaultDebug = debug('git-exec')

export const gitExec = <T extends TGitExecContext>(
  opts: T,
): TGitResult<T['sync']> => {
  const debug = opts.debug || defaultDebug
  const { cwd, args = [], sync } = opts

  const execaArgs: [string, readonly string[], SyncOptions] = [
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
    const res = execaSync(...execaArgs)
    return (log(res.stdout || res.stderr) as unknown) as TGitResult<
      T['sync']
    >
  }

  return (execa(...execaArgs).then(({ stdout , stderr}) =>
    log(stdout.toString() || stderr.toString()),
  ) as unknown) as TGitResult<T['sync']>
}
