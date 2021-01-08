import tempy from "tempy";
import execa from "execa";
import {gitConfig} from '@qiwi/semrel-testing-suite'
import findUp, {Match} from 'find-up'
import path from 'path'
import fs from 'fs'


export const gitFindUp = async (cwd?: string): Promise<Match> => findUp(async directory => {
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
  return match
    ? match[1]
    : undefined

}, {type: 'directory', cwd})

export const gitInit = async (cwd = tempy.directory(), branch = 'master'): Promise<string> => {
  if (await gitFindUp(cwd)) {
    return cwd
  }

  // Check params.
  // check(branch, 'branch: kebab')

  await execa('git', ['init'], { cwd })
  await execa('git', ['checkout', '-b', branch], { cwd })

  // Disable GPG signing for commits.
  gitConfig(cwd, 'commit.gpgsign', false)

  // Return directory.
  return cwd
}

export const gitAddRemote = async (cwd: string, url: string, remote = 'origin'): Promise<void> => {
  await execa('git', ['remote', 'add', remote, url], { cwd })
}

export const gitFetch = async (cwd: string, remote = 'origin', branch?: string): Promise<void> => {
  if (branch) {
    await execa('git', ['fetch', remote, branch], { cwd })
    return
  }

  await gitFetchAll(cwd)
}

export const gitFetchAll = async (cwd: string): Promise<void> => {
  await execa('git', ['fetch', '--all'], { cwd })
}
