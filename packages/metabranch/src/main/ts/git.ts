import { gitConfig } from '@qiwi/semrel-testing-suite'
import execa from 'execa'
import findUp, { Match } from 'find-up'
import fs from 'fs'
import path from 'path'
import tempy from 'tempy'

export const gitFindUp = async (cwd?: string): Promise<Match> =>
  findUp(
    async (directory) => {
      const gitDir = path.join(directory, '.git')
      const exists = await findUp.exists(gitDir)

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
    },
    { type: 'directory', cwd },
  )

export const gitInit = async (
  cwd = tempy.directory(),
  branch?: string,
): Promise<string> => {
  if (await gitFindUp(cwd)) {
    return cwd
  }

  // Check params.
  // check(branch, 'branch: kebab')

  await execa('git', ['init'], { cwd })

  if (branch) {
    await execa('git', ['checkout', '-b', branch], { cwd })
  }

  // Disable GPG signing for commits.
  gitConfig(cwd, 'commit.gpgsign', false)

  // Return directory.
  return cwd
}

export const gitAddRemote = async (
  cwd: string,
  url: string,
  remote = 'origin',
): Promise<void> => {
  await execa('git', ['remote', 'add', remote, url], { cwd })
}

export const gitFetch = async (
  cwd: string,
  remote = 'origin',
  branch?: string,
): Promise<void> => {
  if (branch) {
    await execa('git', ['fetch', remote, branch], { cwd })
    return
  }

  await gitFetchAll(cwd)
}

export const gitSetRemoteHead = async (
  cwd: string,
  remote = 'origin',
): Promise<void> => {
  await execa('git', ['remote', 'set-head', remote, '--auto'], { cwd })
}

export const gitFetchAll = async (cwd: string): Promise<void> => {
  await execa('git', ['fetch', '--all'], { cwd })
}

export const gitCheckout = async (
  cwd: string,
  branch: string,
): Promise<void> => {
  await execa('git', ['checkout', '-f', branch], { cwd })
}

export const gitAdd = async (cwd: string, file = '.'): Promise<void> => {
  // Check params.
  // check(cwd, 'cwd: absolute')

  await execa('git', ['add', file], { cwd })
}

/**
 * Get the current HEAD SHA in a local Git repository.
 *
 * @param {string} cwd The CWD of the Git repository.
 * @return {Promise<string>} Promise that resolves to the SHA of the head commit.
 */
export const gitGetHead = async (cwd: string): Promise<string> => {
  // Check params.
  // check(cwd, 'cwd: absolute')

  // Await command and return HEAD SHA.
  return (await execa('git', ['rev-parse', 'HEAD'], { cwd })).stdout
}

export const gitCommit = async (
  cwd: string,
  message: string,
): Promise<string> => {
  // Check params.
  // check(cwd, 'cwd: absolute')
  // check(message, 'message: string+')

  // Await the command.
  await execa('git', ['commit', '-m', message, '--no-gpg-sign'], { cwd })

  // Return HEAD SHA.
  return gitGetHead(cwd)
}

export const gitPush = async (
  cwd: string,
  remote = 'origin',
  branch = 'master',
): Promise<string> => {
  // Check params.
  // check(cwd, 'cwd: absolute')
  // check(remote, 'remote: string')
  // check(branch, 'branch: lower')

  // Await command.
  await execa('git', ['push', '--tags', remote, `HEAD:refs/heads/${branch}`], {
    cwd,
  })

  return (await execa('git', ['rev-parse', 'HEAD'], { cwd })).stdout
}

export const gitRebaseToRemote = async (
  cwd: string,
  remote = 'origin',
  branch = 'master',
): Promise<void> => {
  await execa('git', ['rebase', `${remote}/${branch}`], { cwd })
}

export const gitPushRebase = async (
  cwd: string,
  remote = 'origin',
  branch = 'master',
): Promise<string> => {
  let retries = 5

  while (retries > 0) {
    try {
      try {
        await gitFetch(cwd, remote, branch)
        await gitRebaseToRemote(cwd, remote, branch)
      } catch (e) {
        console.warn('rebase failed', e)
      }

      return await gitPush(cwd, remote, branch)
    } catch (e) {
      retries -= 1
      console.warn('push failed', 'retries left', retries, e)
    }
  }

  return ''
}

export const gitShowCommitted = async (
  cwd: string,
  hash = 'HEAD',
): Promise<string[]> => {
  return (
    await execa('git', ['diff-tree', '--no-commit-id', '--name-only', '-r', hash], { cwd })
  ).stdout.split('\n')
}
