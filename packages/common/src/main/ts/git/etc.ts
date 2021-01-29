import { gitExec, IGitCommon, TGitResult } from './exec'

/**
 * Get the current HEAD SHA in a local Git repository.
 *
 * @param {string} cwd The CWD of the Git repository.
 * @return {Promise<string>} Promise that resolves to the SHA of the head commit.
 */

export const gitGetHead = <T extends IGitCommon>({
  cwd,
  sync,
}: T): TGitResult<T> => {
  return gitExec({
    cwd,
    sync,
    args: ['git', 'rev-parse', 'HEAD'],
  }) as TGitResult<T>
}
