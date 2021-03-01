import { formatFlags } from '../flags'
import { gitExec, IGitCommon, TGitResult } from './exec'

export interface IGitCheckout extends IGitCommon {
  branch: string
  b?: boolean
  f?: boolean
}

export const gitCheckout = <T extends IGitCheckout>({
  cwd,
  sync,
  branch,
  b,
  f = !b,
}: T): TGitResult<T['sync']> => {
  // check(branch, 'branch: kebab')

  const flags = formatFlags({ b, f })

  return gitExec({
    cwd,
    sync: sync as T['sync'],
    args: ['checkout', ...flags, branch],
  })
}
