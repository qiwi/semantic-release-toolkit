import { gitExec, IGitCommon, TGitResult } from './exec'

export interface IGitBranch extends IGitCommon {
  branch: string
}

/**
 * Create a branch in a local Git repository.
 *
 * @param {string} cwd The CWD of the Git repository.
 * @param {string} branch Branch name to create.
 * @returns {Promise<void>} Promise that resolves when done.
 */
export const gitBranch = <T extends IGitBranch>({
  cwd,
  sync,
  branch,
}: T): TGitResult<T['sync']> => {
  // Check params.
  // check(cwd, 'cwd: absolute')
  // check(branch, 'branch: lower')

  return gitExec({
    cwd,
    sync: sync as T['sync'],
    args: ['branch', branch],
  })
}
