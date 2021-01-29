import findUp, { Match } from 'find-up'
import fs from 'fs'
import { Extends } from '@qiwi/substrate'
import path from 'path'
import tempy from 'tempy'
import { effect } from '../misc'
import { gitExec, TGitResult } from './exec'

export interface IGitInit {
  cwd?: string
  sync?: boolean
}

export const gitFindUp = <S>(
  cwd?: string,
  sync?: S,
): Extends<S, boolean, Match, Promise<Match>> => {
  const exec = sync ? findUp.sync : findUp

  return exec(
    (directory) => {
      const gitDir = path.join(directory, '.git')

      return effect(exec.exists(gitDir), (exists) => {
        if (!exists) {
          return
        }

        const isDirectory = fs.lstatSync(gitDir).isDirectory()
        if (isDirectory) {
          return directory
        }

        const gitRef = fs.readFileSync(gitDir, { encoding: 'utf-8' })
        const match = /^gitdir: (.*)\.git\s*$/.exec(gitRef)

        return match ? match[1] : undefined
      })
    },
    { type: 'directory', cwd },
  ) as Extends<S, boolean, Match, Promise<Match>>
}

export const gitInit = <T extends IGitInit>({
  cwd = tempy.directory(),
  sync,
}: T): TGitResult<T> =>
  effect(gitFindUp(cwd, sync), (parentGitDir) => {
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

/*if (branch) {
    await execa('git', ['checkout', '-b', branch], { cwd })
  }

  // Disable GPG signing for commits.
  await gitConfig({cwd, key: 'commit.gpgsign', value: false})*/
