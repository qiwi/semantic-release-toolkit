import { exec, format } from '../misc'
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
}: T): TGitResult<T['sync']> =>
  gitExec({
    cwd,
    args: ['rev-parse', 'HEAD'],
    sync: sync as T['sync'],
  })

export interface IGitShowCommitted extends IGitCommon {
  hash?: string
}

export const gitShowCommitted = <T extends IGitShowCommitted>({
  cwd,
  sync,
  hash = 'HEAD',
}: T): TGitResult<T['sync'], string[]> =>
  exec(
    () =>
      gitExec({
        cwd,
        sync: sync as T['sync'],
        args: ['diff-tree', '--no-commit-id', '--name-only', '-r', hash],
      }),
    (stdout) => format(sync as T['sync'], (stdout as string).split('\n')),
  )

export const gitStatus = <T extends IGitCommon>({
  cwd,
  sync,
}: T): TGitResult<T['sync']> =>
  gitExec({
    cwd,
    sync: sync as T['sync'],
    args: ['status', '--short'],
  })
