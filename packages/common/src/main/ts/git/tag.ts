import { effect } from '../misc'
import { gitExec, IGitCommon, TGitResult } from './exec'

export interface IGitTag extends IGitCommon {
  tag?: string
  hash?: string
}

/**
 * Create a tag on the HEAD commit in a local Git repository.
 *
 * @param {string} cwd The CWD of the Git repository.
 * @param {string} tag The tag name to create.
 * @param {string} hash=false SHA for the commit on which to create the tag. If falsy the tag is created on the latest commit.
 * @returns {Promise<void>} Promise that resolves when done.
 */
export const gitTag = <T extends IGitTag>({
  cwd,
  sync,
  tag,
  hash,
}: T): TGitResult<T> => {
  // Check params.
  // check(cwd, 'cwd: absolute')
  // check(tag, 'tagName: string+')
  // check(hash, 'hash: alphanumeric{40}?')

  const flags = hash ? ['-f', tag, hash] : [tag]

  return gitExec({
    cwd,
    sync,
    args: ['tag', ...flags],
  }) as TGitResult<T>
}

/**
 * Get tag list associated with a commit SHA.
 *
 * @param {string} cwd The CWD of the Git repository.
 * @param {string} hash The commit SHA for which to retrieve the associated tag.
 * @return {Promise<string>} The tag associated with the SHA in parameter or `null`.
 */
export const gitGetTags = <T extends IGitTag>({
  cwd,
  sync,
  hash,
}: T): TGitResult<T, string[]> => {
  // Check params.
  // check(cwd, 'cwd: absolute')
  // check(hash, 'hash: alphanumeric{40}')

  return effect(
    gitExec({
      cwd,
      sync,
      args: ['tag', '--merged', hash],
    }),
    (tags) => (tags ? tags.split('\n') : []),
  ) as TGitResult<T, string[]>
}

/**
 * Get the first commit SHA tagged `tagName` in a local Git repository.
 *
 * @param {string} cwd The CWD of the Git repository.
 * @param {string} tag Tag name for which to retrieve the commit sha.
 * @return {Promise<string>} Promise that resolves to the SHA of the first commit associated with `tagName`.
 */
export const gitGetTagHash = <T extends IGitTag>({
  cwd,
  sync,
  tag,
}: T): TGitResult<T> => {
  // Check params.
  // Check params.
  // check(cwd, 'cwd: absolute')
  // check(tag, 'tag: string+')

  return gitExec({
    cwd,
    sync,
    args: ['rev-list', '-1', tag],
  }) as TGitResult<T>
}
