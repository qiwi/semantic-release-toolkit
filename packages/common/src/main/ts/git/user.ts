import { exec } from '../misc'
import { gitConfigAdd } from './config'
import { IGitCommon, TGitResult } from './exec'

export interface IGitSetUser extends IGitCommon {
  name: string
  email: string
}

/**
 * Set user for git repo.
 *
 * @param {string} cwd The CWD of the Git repository.
 * @param {string} name User name.
 * @param {string} email User email.
 * @returns {Promise<void>} Promise that resolves when done.
 */
export const gitSetUser = <T extends IGitSetUser>({
  cwd,
  name,
  email,
  sync,
}: T): TGitResult<T['sync']> => {
  // check(email, 'email: string+')
  // check(name, 'name: string+')

  return exec(
    () => gitConfigAdd({ cwd, sync: sync as T['sync'], key: 'user.name', value: name }),
    () => gitConfigAdd({ cwd, sync: sync as T['sync'], key: 'user.email', value: email })
  )
}
