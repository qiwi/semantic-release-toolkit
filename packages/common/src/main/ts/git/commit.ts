import { formatFlags } from '../flags'
import { exec } from '../misc'
import { gitGetHead } from './etc'
import { gitExec, IGitCommon, TGitResult } from './exec'

export interface IGitCommit extends IGitCommon {
  message: string
  all?: boolean
}

/**
 * Get the current HEAD SHA in a local Git repository.
 *
 * @param {string} cwd The CWD of the Git repository.
 * @return {Promise<string>} Promise that resolves to the SHA of the head commit.
 */
export const gitCommit = <T extends IGitCommit>({
  cwd,
  sync,
  message,
  all,
}: T): TGitResult<T['sync']> => {
  // check(cwd, 'cwd: absolute')
  // check(message, 'message: string+')

  const flags = formatFlags({ all, message })

  return exec(
    () =>
      gitExec({
        cwd,
        sync,
        args: ['commit', ...flags, '--no-gpg-sign'],
      }),
    () => gitGetHead({ cwd, sync: sync as T['sync'] }),
  )
}

// export const a: string = gitCommit({sync: false, cwd: 'a', message: 'ff'})
