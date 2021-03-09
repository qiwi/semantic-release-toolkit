import { gitRoot } from '@antongolub/git-root'
import fileUrl from 'file-url'
import tempy from 'tempy'

import { formatFlags } from '../flags'
import { exec, format } from '../misc'
import { gitCheckout } from './checkout'
import { gitExec, TGitResult } from './exec'
import { gitPush } from './push'
import { gitRemoteAdd } from './remote'

export interface IGitInit {
  cwd?: string
  sync?: boolean
  bare?: boolean
}

export interface IGitInitOrigin extends IGitInit {
  cwd: string
  branch?: string
}

export { gitRoot }

export const gitInit = <T extends IGitInit>({
  cwd = tempy.directory(),
  sync,
  bare,
}: T): TGitResult<T['sync']> =>
  exec(
    () => gitRoot(cwd, sync),
    (parentGitDir) => {
      if (parentGitDir) {
        throw new Error(
          `${cwd} belongs to repo ${parentGitDir as string} already`,
        )
      }
    },
    () => {
      const flags = formatFlags({ bare })

      return gitExec({
        cwd: cwd as string,
        sync,
        args: ['init', ...flags],
      })
    },
    () => format(sync as T['sync'], cwd),
  )

/**
 * Init bare Git repository in a temp directory.
 *
 * @return {Promise<string>} Promise that resolves to string URL of the of the remote origin.
 */
export const gitInitRemote = <T extends IGitInit>({
  cwd,
  sync,
}: T): TGitResult<T['sync']> =>
  exec(
    () => gitInit({ cwd, sync, bare: true }),
    // Turn remote path into a file URL.
    (cwd) => format(sync as T['sync'], fileUrl(cwd)),
  )

/**
 * Create a remote Git repository and set it as the origin for a Git repository.
 * _Created in a temp folder._
 *
 * @param {string} cwd The cwd to create and set the origin for.
 * @param {string} [releaseBranch] Optional branch to be added in case of prerelease is activated for a branch.
 * @return {Promise<string>} Promise that resolves to string URL of the of the remote origin.
 */
export const gitInitOrigin = <T extends IGitInitOrigin>({
  cwd,
  sync,
  branch,
}: T): TGitResult<T['sync']> => {
  // Check params.
  // check(cwd, 'cwd: absolute')

  let url: string

  return exec(
    // Turn remote path into a file URL.
    () => gitInitRemote({ sync, cwd }),
    (_url) => {
      url = _url
    },
    () => gitRemoteAdd({ sync, cwd, url }),
    () =>
      // Set up a release branch. Return to master afterwards.
      branch &&
      exec(
        // sync as T['sync'],
        () => gitCheckout({ cwd, sync, branch, b: true }),
        () => gitCheckout({ cwd, sync, branch: 'master' }),
      ),
    () => gitPush({ cwd, sync, branch }),
    () => format(sync as T['sync'], url),
  )
}

/*  (cwd: string, releaseBranch?: string): string => {
  // Check params.
  check(cwd, 'cwd: absolute')

  // Turn remote path into a file URL.
  const url = gitInitRemote()

  // Set origin on local repo.
  execa.sync('git', ['remote', 'add', 'origin', url], { cwd })

  // Set up a release branch. Return to master afterwards.
  if (releaseBranch) {
    execa.sync('git', ['checkout', '-b', releaseBranch], { cwd })
    execa.sync('git', ['checkout', 'master'], { cwd })
  }

  execa.sync('git', ['push', '--all', 'origin'], { cwd })

  // Return URL for remote.
  return url
} */
