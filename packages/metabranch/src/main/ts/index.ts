import tempy from 'tempy'
import {
  TSyncOptions
} from './interface'
import {
  gitFetch,
  gitInit,
  gitCheckout,
  gitAddRemote,
  gitSetRemoteHead,
} from './git'

export * from './interface'

export const fetch = async (opts: TSyncOptions): Promise<void> => {
  const {
    branch,
    from,
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

  console.log('from=', from)
  console.log('cwd=', cwd)
}

export const push = async (): Promise<void> => {

}
