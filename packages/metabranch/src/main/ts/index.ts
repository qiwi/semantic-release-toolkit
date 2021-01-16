import tempy from 'tempy'
import {
  TSyncOptions
} from './interface'
import {
  gitAdd,
  gitCommit,
  gitFetch,
  gitInit,
  gitCheckout,
  gitAddRemote,
  gitSetRemoteHead,
  gitPushRebase,
} from './git'
import fs from 'fs-extra'
import path from 'path'
import globby from 'globby'

export * from './interface'

export const prepareTempRepo = async (cwd: string, repo: string, branch: string): Promise<string> => {
  await gitInit(cwd)
  await gitAddRemote(cwd, repo)

  try {
    await gitFetch(cwd, 'origin', branch)
    await gitCheckout(cwd, `origin/${branch}`)
  } catch {
    await gitFetch(cwd, 'origin')
    await gitSetRemoteHead(cwd, 'origin')
    await gitCheckout(cwd, `origin/HEAD`)
  }

  return cwd
}

export const fetch = async (opts: TSyncOptions): Promise<void> => {
  const {
    branch,
    from,
    to,
    cwd = process.cwd(),
    temp = tempy.directory(),
    repo,
  } = opts

  await prepareTempRepo(temp, repo, branch)

  const files = await globby(from, { cwd: temp, absolute: true })

  files
      .forEach(file => fs.copySync(file, path.resolve(cwd, to, path.relative(temp, file))))
}

export const push = async (opts: TSyncOptions): Promise<string> => {
  const {
    from,
    to,
    branch,
    repo,
    cwd = process.cwd(),
    temp = tempy.directory()
  } = opts

  await prepareTempRepo(temp, repo, branch)

  const files = await globby(from, { cwd, absolute: true })

  console.log('opts=', opts)
  console.log('files=', files)


  files
    .forEach(file => fs.copySync(file, path.resolve(temp, to, path.relative(cwd, file))))

  await gitAdd(temp)

  const commitId = await gitCommit(temp, 'update meta')

  await gitPushRebase(temp, 'origin', `refs/heads/${branch}`)

  return commitId
}
