import { gitRoot } from '@antongolub/git-root'
import fileUrl from 'file-url'
import tempy from 'tempy'

import { formatFlags } from '../flags'
import { effect } from '../misc'
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
  sync?: boolean
  branch?: string
}

export { gitRoot }

export const gitInit = <T extends IGitInit>({
  cwd = tempy.directory(),
  sync,
  bare,
}: T): TGitResult<T> =>
  effect(gitRoot(cwd, sync), (parentGitDir) => {
    if (parentGitDir) {
      throw new Error(
        `${cwd} belongs to repo ${parentGitDir as string} already`,
      )
    }

    const flags = formatFlags({ bare })

    return effect(
      gitExec({
        cwd: cwd as string,
        sync,
        args: ['init', ...flags],
      }),
      () => cwd,
    )
  }) as TGitResult<T>

/**
 * Init bare Git repository in a temp directory.
 *
 * @return {Promise<string>} Promise that resolves to string URL of the of the remote origin.
 */
export const gitInitRemote = <T extends IGitInit>({
  cwd,
  sync,
}: T): TGitResult<T> =>
  effect(gitInit({ cwd, sync, bare: true }), (cwd) =>
    // Turn remote path into a file URL.
    fileUrl(cwd),
  ) as TGitResult<T>

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
}: T): TGitResult<T> => {
  // Check params.
  // check(cwd, 'cwd: absolute')

  return effect(gitInitRemote({ sync, cwd }), (url) =>
    effect(gitRemoteAdd({ sync, cwd, url }), () =>
      effect(
        () =>
          // Create remote branch if specified
          branch
            ? effect(gitCheckout({ cwd, sync, branch, b: true }), () =>
                gitCheckout({ cwd, sync, branch: 'master' }),
              )
            : undefined,
        // Push state to remote origin
        () => effect(gitPush({ cwd, sync, branch }), () => url),
      ),
    ),
  ) as TGitResult<T>
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
