import fs from 'fs-extra'
import globby from 'globby'
import path from 'path'
import tempy from 'tempy'

import { defaults } from './defaults'
import {
  gitAdd,
  gitAddRemote,
  gitCheckout,
  gitCommit,
  gitFetch,
  gitInit,
  gitPushRebase,
  gitSetRemoteHead,
  gitShowCommitted,
} from './git'
import {
  TActionOptions,
  TActionOptionsNormalized,
  TActionType,
} from './interface'

export const prepareTempRepo = async (
  cwd: string,
  repo: string,
  branch: string,
): Promise<string> => {
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

export const normalizeOptions = ({
  branch = defaults.branch,
  from = defaults.from,
  to = defaults.to,
  message = defaults.message,
  cwd = process.cwd(),
  temp = tempy.directory(),
  repo,
  debug,
}: TActionOptions): TActionOptionsNormalized => ({
  branch,
  from,
  to,
  message,
  cwd,
  temp,
  repo,
  debug,
})

export const fetch = async (opts: TActionOptions): Promise<void> => {
  const { branch, from, to, cwd, temp, repo, debug } = normalizeOptions(opts)

  await prepareTempRepo(temp, repo, branch)

  const files = await globby(from, { cwd: temp, absolute: true })

  files.forEach((src) => {
    const dest = path.resolve(cwd, to, path.relative(temp, src))
    debug('copy', 'src=', src, 'dest=', dest)

    fs.copySync(src, dest)
  })
}

export const push = async (opts: TActionOptions): Promise<string> => {
  const {
    branch,
    from,
    to,
    cwd,
    temp,
    repo,
    message,
    debug,
  } = normalizeOptions(opts)

  await prepareTempRepo(temp, repo, branch)

  const files = await globby(from, { cwd, absolute: true })

  files.forEach((src) => {
    const dest = path.resolve(temp, to, path.relative(cwd, src))
    debug('copy', 'src=', src, 'dest=', dest)

    fs.copySync(src, dest)
  })

  await gitAdd(temp)

  await gitCommit(temp, message)

  const commitId = await gitPushRebase(temp, 'origin', branch)
  const committedFiles = await gitShowCommitted(temp, commitId)

  debug('commitId=', commitId, 'committedFiles=', committedFiles.join(', '))

  return commitId
}

export const perform = async (
  action: TActionType,
  options: TActionOptions,
): Promise<string | void> => {
  if (action === 'push') {
    return push(options)
  }

  if (action === 'fetch') {
    return fetch(options)
  }

  throw new Error(
    `[metabranch] unsupported action '${action}'. Allowed values: 'fetch' and 'push'`,
  )
}
