import execa from 'execa'

// import { check } from 'blork'

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

/*export const gitPushRebase = async (
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
}*/

export const gitShowCommitted = async (
  cwd: string,
  hash = 'HEAD',
): Promise<string[]> => {
  return (
    await execa(
      'git',
      ['diff-tree', '--no-commit-id', '--name-only', '-r', hash],
      { cwd },
    )
  ).stdout.split('\n')
}

export const gitStatus = async (cwd: string): Promise<string> => {
  // Check params.
  // check(cwd, 'cwd: absolute')

  // Run command.
  return (await execa('git', ['status', '--short'], { cwd })).stdout
}
