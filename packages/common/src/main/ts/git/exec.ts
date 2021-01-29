import { nanoid } from 'nanoid'
import execa from 'execa'
import { Extends } from '@qiwi/substrate'
import debug, { Debugger } from 'debug'

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

export const gitExec = <T extends TGitExecContext>(
  context: T,
): TGitResult<T> => {
  const { sync, cwd, args = [], debug: _debug } = context
  const debug = _debug || defaultDebug
  const execaArgs: [string, string[], any] = ['git', args, { cwd }]
  const gitExecId = nanoid()
  const log = <T>(output: T): T => {
    debug(`[${gitExecId}]`, output)
    return output
  }

  log(execaArgs)

  if (sync === true) {
    return log(execa.sync(...execaArgs).stdout.toString()) as TGitResult<T>
  }

  return execa(...execaArgs).then(({ stdout }) =>
    log(stdout.toString()),
  ) as TGitResult<T>
}
