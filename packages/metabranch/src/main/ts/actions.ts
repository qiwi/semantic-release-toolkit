import fs from 'fs-extra'
import globby from 'globby'
import path from 'path'
import tempy from 'tempy'
import { Debugger } from '@qiwi/semrel-plugin-creator'

import { defaults } from './defaults'
import {
  gitAddAll,
  gitAddRemote,
  gitCheckout,
  gitCommit,
  gitFetch,
  gitInit,
  gitPushRebase,
  gitSetRemoteHead,
  gitShowCommitted,
  gitStatus,
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

const synchronize = async (
  from: string | string[],
  to: string,
  baseFrom: string,
  baseTo: string,
  debug: Debugger
): Promise<void> => {

  const copy = (src: string, dest: string) => {
    debug('copy', 'from=', src, 'to=', dest)
    return fs.copy(src, dest)
  }
  const entries: string[] = ([] as string[]).concat(from)
  const patterns: string[] = []
  const dirs: string[] = []

  await Promise.all(entries.map(async (entry: string) => {
    const entryAbs = path.resolve(baseFrom, entry)

    if ((await fs.lstat(entryAbs))?.isDirectory()) {
      dirs.push(entryAbs)

      return
    }

    patterns.push(entry)
  }))

  await globby(patterns, { cwd: baseFrom, absolute: true }).then(files =>
    Promise.all(
      [
        ...files.map(file => copy(file, path.resolve(baseTo, to, path.relative(baseFrom, file)))),
        ...dirs.map(dir => copy(dir, path.resolve(baseTo, to)))
      ]
    )
  )

}

export const fetch = async (opts: TActionOptions): Promise<void> => {
  const { branch, from, to, cwd, temp, repo, debug } = normalizeOptions(opts)

  await prepareTempRepo(temp, repo, branch)

  await synchronize(from, temp, to, cwd, debug)

  /*const sources = await absolutize(from, temp)

  sources.forEach((src) => {
    const dest = path.resolve(cwd, to, path.relative(temp, src))
    debug('copy', 'src=', src, 'dest=', dest)

    fs.copySync(src, dest)
  })*/
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

  await synchronize(from, cwd, to, temp, debug)

  /*const sources = await absolutize(from, cwd)

  sources.forEach((src) => {
    const dest = path.resolve(temp, to, path.relative(cwd, src))
    debug('copy', 'src=', src, 'dest=', dest)

    fs.copySync(src, dest)
  })*/

  await gitAddAll(temp)

  const status = await gitStatus(temp)
  debug('status=', status)

  if (!status) {
    // debug('contents=', fs.readdirSync(temp))
    return ''
  }

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
