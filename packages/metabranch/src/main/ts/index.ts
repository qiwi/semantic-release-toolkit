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
  gitPush,
} from './git'
import fs from 'fs-extra'
import path from 'path'
import globby from 'globby'
// import execa from "execa";

// const _opts: GlobbyOptions = { cwd: 'string', gitignore: false }

export * from './interface'

export const prepareTempRepo = async (opts: TSyncOptions): Promise<string> => {
  const {
    branch,
    cwd = tempy.directory(),
    repo
  } = opts

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
    cwd = tempy.directory(),
    repo
  } = opts

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

  fs.copySync(path.resolve(cwd, from + ''), path.resolve(to))

  console.log('from=', from)
  console.log('cwd=', cwd)
}

export const push = async (opts: TSyncOptions): Promise<string> => {
  const { from, to, branch, base = process.cwd() } = opts
  const cwd = await prepareTempRepo(opts)
  const files = await globby(from, { cwd: base })




  // const _to = path.resolve(cwd, to)
  // const __from = path.resolve(from + '')
  // fs.copySync(__from, _to)

  files
    .forEach(file => {
      fs.copySync(file, path.resolve(cwd, to, path.relative(base, file)))
    })



/*  console.log('from=', from)
  console.log('to=', to)
  console.log('dir=', fs.readdirSync(path.resolve(cwd, to)))
  console.log('cwd=', fs.readdirSync(cwd))
  console.log('untracked=', await execa('git', ['ls-files', '.', '--exclude-standard', '--others'], { cwd }))
 */
  await gitAdd(cwd)
  // console.log('diff=', await execa('git', ['diff', '--cached', '--name-only'], { cwd }))
  const commitId = await gitCommit(cwd, 'update meta')

  await gitPush(cwd, 'origin', `refs/heads/${branch}`)

  return commitId
}
