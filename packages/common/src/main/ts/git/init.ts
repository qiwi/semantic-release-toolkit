import { gitRoot } from '@antongolub/git-root'
import tempy from 'tempy'

import { effect } from '../misc'
import { gitExec, TGitResult } from './exec'

export interface IGitInit {
  cwd?: string
  sync?: boolean
}

export { gitRoot }

export const gitInit = <T extends IGitInit>({
  cwd = tempy.directory(),
  sync,
}: T): TGitResult<T> =>
  effect(gitRoot(cwd, sync), (parentGitDir) => {
    if (parentGitDir) {
      throw new Error(
        `${cwd} belongs to repo ${parentGitDir as string} already`,
      )
    }

    return effect(
      gitExec({
        cwd,
        sync,
        args: ['init'],
      }),
      () => cwd,
    )
  }) as TGitResult<T>

/* if (branch) {
    await execa('git', ['checkout', '-b', branch], { cwd })
  }

  // Disable GPG signing for commits.
  await gitConfig({cwd, key: 'commit.gpgsign', value: false}) */
