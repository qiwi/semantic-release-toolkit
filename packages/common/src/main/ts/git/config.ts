import { gitExec, IGitCommon, TGitResult } from './exec'

export interface IGitConfigAdd extends IGitCommon {
  key: string
  value: any
}

export interface IGitConfigGet extends IGitCommon {
  key: string
}

/**
 * Add a Git config setting.
 *
 * @param {string} cwd The CWD of the Git repository.
 * @param {string} name Config name.
 * @param {any} value Config value.
 * @returns {Promise<void>} Promise that resolves when done.
 */
export const gitConfigAdd = <T extends IGitConfigAdd>({
  cwd,
  key,
  value,
  sync,
}: T): TGitResult<T> => {
  // check(cwd, 'cwd: absolute')
  // check(name, 'name: string+')

  return gitExec({
    cwd,
    sync,
    args: ['config', '--add', key, value],
  }) as TGitResult<T>
}

export const gitConfig = gitConfigAdd

/**
 * Get a Git config setting.
 *
 * @param {string} cwd The CWD of the Git repository.
 * @param {string} name Config name.
 * @returns {Promise<void>} Promise that resolves when done.
 */
export const gitConfigGet = <T extends IGitConfigGet>({
  cwd,
  key,
  sync,
}: T): TGitResult<T> => {
  // check(cwd, 'cwd: absolute')
  // check(name, 'name: string+')

  return gitExec({
    cwd,
    sync,
    args: ['config', key],
  }) as TGitResult<T>
}
