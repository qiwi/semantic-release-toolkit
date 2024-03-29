import {
  gitAddAll,
  gitCheckout,
  gitCommit,
  gitFetch,
  gitInit,
  gitPushRebase,
  gitRemoteAdd,
  gitRemoteSetHead,
  gitSetUser,
  gitShowCommitted,
  gitStatus,
} from '@qiwi/git-utils'
import { Debugger } from '@qiwi/semrel-plugin-creator'
import fs from 'fs-extra'
import { globby } from 'globby'
import path from 'path'

import { TActionOptionsNormalized, TActionType, TUserInfo } from './interface'

export const prepareTempRepo = async (
  cwd: string,
  repo: string,
  branch: string,
  { email, name }: TUserInfo,
): Promise<string> => {
  await gitInit({ cwd })
  await gitSetUser({ cwd, name, email })
  await gitRemoteAdd({ cwd, url: repo, remote: 'origin' })

  try {
    await gitFetch({ cwd, remote: 'origin', branch })
    await gitCheckout({ cwd, branch: `origin/${branch}` })
  } catch {
    await gitFetch({ cwd, remote: 'origin' })
    await gitRemoteSetHead({ cwd, remote: 'origin' })
  }

  return cwd
}

type TSyncOptions = {
  from: string | string[]
  to: string
  baseFrom: string
  baseTo: string
  debug: Debugger
}

const synchronize = async ({
  from,
  to,
  baseFrom,
  baseTo,
  debug,
}: TSyncOptions): Promise<void> => {
  const copy = (src: string, dest: string) => {
    debug('copy', 'from=', src, 'to=', dest)
    return fs.copy(src, dest)
  }
  const entries: string[] = Array.isArray(from) ? from : [from]
  const patterns: string[] = []
  const dirs: string[] = []

  await Promise.all(
    entries.map(async (entry: string) => {
      const entryAbs = path.resolve(baseFrom, entry)

      try {
        if ((await fs.lstat(entryAbs))?.isDirectory()) {
          dirs.push(entryAbs)

          return
        }
      } catch {}

      patterns.push(entry)
    }),
  )

  await globby(patterns, { cwd: baseFrom, absolute: true }).then((files) =>
    Promise.all([
      ...files.map((file) =>
        copy(file, path.resolve(baseTo, to, path.relative(baseFrom, file))),
      ),
      ...dirs.map((dir) => copy(dir, path.resolve(baseTo, to))),
    ]),
  )
}

export const fetch = async (opts: TActionOptionsNormalized): Promise<void> => {
  const { branch, from, to, cwd, temp, repo, debug, user } = opts

  await prepareTempRepo(temp, repo, branch, user)

  await synchronize({ from, to, baseFrom: temp, baseTo: cwd, debug })
}

export const push = async (opts: TActionOptionsNormalized): Promise<string> => {
  const { branch, from, to, cwd, temp, repo, message, debug, user } = opts

  await prepareTempRepo(temp, repo, branch, user)

  await synchronize({ from, to, baseFrom: cwd, baseTo: temp, debug })

  await gitAddAll({ cwd: temp })

  const status = await gitStatus({ cwd: temp })
  debug('status=', status)

  if (!status) {
    // debug('contents=', fs.readdirSync(temp))
    return ''
  }

  await gitCommit({ cwd: temp, message })

  const commitId = await gitPushRebase({ cwd: temp, remote: 'origin', branch })
  const committedFiles = await gitShowCommitted({ cwd: temp, hash: commitId })

  debug('commitId=', commitId, 'committedFiles=', committedFiles.join(', '))

  return commitId
}

export const perform = async (
  action: TActionType,
  options: TActionOptionsNormalized,
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
