import tempy from 'tempy'
import {
  TSyncOptions
} from './interface'
import {
  gitInit
} from './git'

export * from './interface'

export const fetch = async (opts: TSyncOptions): Promise<void> => {
  const { from } = opts
  const cwd = tempy.directory()

  await gitInit(cwd)

  console.log('from=', from)
  console.log('cwd=', cwd)
}

export const push = async (): Promise<void> => {

}
