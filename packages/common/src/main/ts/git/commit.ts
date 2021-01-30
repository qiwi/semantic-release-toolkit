import { effect } from '../misc'
import { gitGetHead } from './etc'
import { gitExec, IGitCommon, TGitResult } from './exec'

export interface IGitCommit extends IGitCommon {
  message: string
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
}: T): TGitResult<T> => {
  return effect(
    gitExec({
      cwd,
      sync,
      args: ['commit', '-m', message, '--no-gpg-sign'],
    }),
    // Return HEAD SHA.
    () => gitGetHead({ cwd, sync }),
  ) as TGitResult<T>
}
