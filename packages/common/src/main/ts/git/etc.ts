import { effect } from '../misc'
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
    args: ['rev-parse', 'HEAD'],
  }) as TGitResult<T>
}

export interface IGitShowCommitted extends IGitCommon {
  hash?: string
}

export const gitShowCommitted = <T extends IGitShowCommitted>({
  cwd,
  sync,
  hash = 'HEAD',
}: T): TGitResult<T, string[]> => {
  return effect(
    gitExec({
      cwd,
      sync,
      args: ['diff-tree', '--no-commit-id', '--name-only', '-r', hash],
    }),
    (stdout) => stdout.split('\n'),
  ) as TGitResult<T, string[]>
}

export const gitStatus = <T extends IGitCommon>({
  cwd,
  sync,
}: T): TGitResult<T> => {
  return gitExec({
    cwd,
    sync,
    args: ['status', '--short'],
  }) as TGitResult<T>
}
