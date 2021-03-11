import {
  exec,
  format,
  gitAddAll,
  gitCheckout,
  gitCommit,
  gitConfigAdd,
  gitInit,
  IGitCommit,
  IGitInit,
  TGitResult,
} from '@qiwi/semrel-common'
import tempy from 'tempy'

export * from '@qiwi/semrel-common'

export interface IGitInitTestingRepo extends IGitInit {
  branch?: string
}

/**
 * Create a Git repository.
 * _Created in a temp folder._
 *
 * @param {string} opts.branch='master' The branch to initialize the repository to.
 * @return {Promise<string>} Promise that resolves to string pointing to the CWD for the created Git repository.
 */
export const gitInitTestingRepo = <T extends IGitInitTestingRepo>({
  branch = 'master',
  sync,
}: T): TGitResult<T['sync']> => {
  const cwd = tempy.directory()

  return exec(
    () => gitInit({ sync, cwd }),
    () =>
      gitCheckout({
        cwd,
        sync,
        branch,
        b: true,
      }),
    // Disable GPG signing for commits.
    () => gitConfigAdd({ cwd, sync, key: 'commit.gpgsign', value: false }),
    () => format(sync as T['sync'], cwd),
  )
}

/**
 * `git add .` followed by `git commit`
 * _Allows empty commits without any files added._
 *
 * @param {string} cwd The CWD of the Git repository.
 * @param {string} message Commit message.
 * @returns {Promise<string>} Promise that resolves to the SHA for the commit.
 */
export const gitCommitAll = <T extends IGitCommit>({
  cwd,
  message,
  sync,
}: T): TGitResult<T['sync']> => {
  // Check params.
  // check(cwd, 'cwd: absolute')
  // check(message, 'message: string+')

  return exec(
    () => gitAddAll({ cwd, sync }),
    () => gitCommit({ cwd, message, sync: sync as T['sync'] }),
  )
}

/*
  effect(gitInit({ sync }), (cwd) =>
    effect(
      gitCheckout({
        cwd,
        sync,
        branch,
        b: true,
      }),
      () =>
        effect(
          // Disable GPG signing for commits.
          gitConfigAdd({ cwd, sync, key: 'commit.gpgsign', value: false }),
          () => cwd,
        ),
    ),
  ) as TGitResult<T> */

// /**
//  * Create a remote Git repository.
//  * _Created in a temp folder._
//  *
//  * @return {Promise<string>} Promise that resolves to string URL of the of the remote origin.
//  */
// export const gitInitRemote = (): string => {
//   // Init bare Git repository in a temp directory.
//   const cwd = tempy.directory()
//   execa.sync('git', ['init', '--bare'], { cwd })
//
//   // Turn remote path into a file URL.
//   return fileUrl(cwd)
// }
//
// /**
//  * Create a remote Git repository and set it as the origin for a Git repository.
//  * _Created in a temp folder._
//  *
//  * @param {string} cwd The cwd to create and set the origin for.
//  * @param {string} [releaseBranch] Optional branch to be added in case of prerelease is activated for a branch.
//  * @return {Promise<string>} Promise that resolves to string URL of the of the remote origin.
//  */
// export const gitInitOrigin = (cwd: string, releaseBranch?: string): string => {
//   // Check params.
//   check(cwd, 'cwd: absolute')
//
//   // Turn remote path into a file URL.
//   const url = gitInitRemote()
//
//   // Set origin on local repo.
//   execa.sync('git', ['remote', 'add', 'origin', url], { cwd })
//
//   // Set up a release branch. Return to master afterwards.
//   if (releaseBranch) {
//     execa.sync('git', ['checkout', '-b', releaseBranch], { cwd })
//     execa.sync('git', ['checkout', 'master'], { cwd })
//   }
//
//   execa.sync('git', ['push', '--all', 'origin'], { cwd })
//
//   // Return URL for remote.
//   return url
// }
//
// // Add.
//
// /**
//  * Add files to staged commit in a Git repository.
//  *
//  * @param {string} cwd The cwd to create and set the origin for.
//  * @param {string} file='.' The file to add, defaulting to '.' (all files).
//  * @return {Promise<void>} Promise that resolves when done.
//  */
// export const gitAdd = (cwd: string, file = '.'): void => {
//   // Check params.
//   check(cwd, 'cwd: absolute')
//
//   // Await command.
//   execa.sync('git', ['add', file], { cwd })
// }
//
// // Commits.
//
// /**
//  * Create commit on a Git repository.
//  * _Allows empty commits without any files added._
//  *
//  * @param {string} cwd The CWD of the Git repository.
//  * @param {string} message Commit message.
//  * @returns {Promise<string>} Promise that resolves to the SHA for the commit.
//  */
// export const gitCommit = (cwd: string, message: string): string => {
//   // Check params.
//   check(cwd, 'cwd: absolute')
//   check(message, 'message: string+')
//
//   // Await the command.
//   execa.sync('git', ['commit', '-m', message, '--no-gpg-sign'], { cwd })
//
//   // Return HEAD SHA.
//   return gitGetHead(cwd)
// }
//
// /**
//  * `git add .` followed by `git commit`
//  * _Allows empty commits without any files added._
//  *
//  * @param {string} cwd The CWD of the Git repository.
//  * @param {string} message Commit message.
//  * @returns {Promise<string>} Promise that resolves to the SHA for the commit.
//  */
// export const gitCommitAll = (cwd: string, message: string): string => {
//   // Check params.
//   check(cwd, 'cwd: absolute')
//   check(message, 'message: string+')
//
//   // Await command.
//   gitAdd(cwd)
//
//   // Await command and return the SHA hash.
//   return gitCommit(cwd, message)
// }
//
// // Push.
//
// /**
//  * Push to a remote Git repository.
//  *
//  * @param {string} cwd The CWD of the Git repository.
//  * @param {string} remote The remote repository URL or name.
//  * @param {string} branch The branch to push.
//  * @returns {Promise<void>} Promise that resolves when done.
//  * @throws {Error} if the push failed.
//  */
// export const gitPush = (
//   cwd: string,
//   remote = 'origin',
//   branch = 'master',
// ): void => {
//   // Check params.
//   check(cwd, 'cwd: absolute')
//   check(remote, 'remote: string')
//   check(branch, 'branch: lower')
//
//   // Await command.
//   execa.sync('git', ['push', '--tags', remote, `HEAD:${branch}`], { cwd })
// }
//
// // Branches.
//
// /**
//  * Create a branch in a local Git repository.
//  *
//  * @param {string} cwd The CWD of the Git repository.
//  * @param {string} branch Branch name to create.
//  * @returns {Promise<void>} Promise that resolves when done.
//  */
// export const gitBranch = (cwd: string, branch: string): void => {
//   // Check params.
//   check(cwd, 'cwd: absolute')
//   check(branch, 'branch: lower')
//
//   // Await command.
//   execa.sync('git', ['branch', branch], { cwd })
// }
//
// /**
//  * Checkout a branch in a local Git repository.
//  *
//  * @param {string} cwd The CWD of the Git repository.
//  * @param {string} branch Branch name to checkout.
//  * @returns {Promise<void>} Promise that resolves when done.
//  */
// // export const gitCheckout = (cwd: string, branch: string): void => {
// //   // Check params.
// //   check(cwd, 'cwd: absolute')
// //   check(branch, 'branch: lower')
// //
// //   // Await command.
// //   execa.sync('git', ['checkout', branch], { cwd })
// // }
//
// // Hashes.
//
// /**
//  * Get the current HEAD SHA in a local Git repository.
//  *
//  * @param {string} cwd The CWD of the Git repository.
//  * @return {Promise<string>} Promise that resolves to the SHA of the head commit.
//  */
// export const gitGetHead = (cwd: string): string => {
//   // Check params.
//   check(cwd, 'cwd: absolute')
//
//   // Await command and return HEAD SHA.
//   return execa.sync('git', ['rev-parse', 'HEAD'], { cwd }).stdout
// }
//
// // Tags.
//
// /**
//  * Create a tag on the HEAD commit in a local Git repository.
//  *
//  * @param {string} cwd The CWD of the Git repository.
//  * @param {string} tagName The tag name to create.
//  * @param {string} hash=false SHA for the commit on which to create the tag. If falsy the tag is created on the latest commit.
//  * @returns {Promise<void>} Promise that resolves when done.
//  */
// export const gitTag = (cwd: string, tagName: string, hash?: string): void => {
//   // Check params.
//   check(cwd, 'cwd: absolute')
//   check(tagName, 'tagName: string+')
//   check(hash, 'hash: alphanumeric{40}?')
//
//   // Run command.
//   execa.sync('git', hash ? ['tag', '-f', tagName, hash] : ['tag', tagName], {
//     cwd,
//   })
// }
//
// /**
//  * Get the tag associated with a commit SHA.
//  *
//  * @param {string} cwd The CWD of the Git repository.
//  * @param {string} hash The commit SHA for which to retrieve the associated tag.
//  * @return {Promise<string>} The tag associated with the SHA in parameter or `null`.
//  */
// export const gitGetTags = (cwd: string, hash: string): string[] => {
//   // Check params.
//   check(cwd, 'cwd: absolute')
//   check(hash, 'hash: alphanumeric{40}')
//
//   // Run command.
//   // const tags = execa.sync('git', ['describe', '--tags', '--exact-match', hash], {
//   const tags = execa.sync('git', ['tag', '--merged', hash], {
//     cwd,
//   }).stdout
//
//   return tags ? tags.split('\n') : []
// }
//
// /**
//  * Get the first commit SHA tagged `tagName` in a local Git repository.
//  *
//  * @param {string} cwd The CWD of the Git repository.
//  * @param {string} tagName Tag name for which to retrieve the commit sha.
//  * @return {Promise<string>} Promise that resolves to the SHA of the first commit associated with `tagName`.
//  */
// export const gitGetTagHash = (cwd: string, tagName: string): string => {
//   // Check params.
//   check(cwd, 'cwd: absolute')
//   check(tagName, 'tagName: string+')
//
//   // Run command.
//   return execa.sync('git', ['rev-list', '-1', tagName], { cwd }).stdout
// }
//
// // Configs.
//
// /**
//  * Add a Git config setting.
//  *
//  * @param {string} cwd The CWD of the Git repository.
//  * @param {string} name Config name.
//  * @param {any} value Config value.
//  * @returns {Promise<void>} Promise that resolves when done.
//  */
// export const gitConfig = (cwd: string, name: string, value: any): void => {
//   // Check params.
//   check(cwd, 'cwd: absolute')
//   check(name, 'name: string+')
//
//   // Run command.
//   execa.sync('git', ['config', '--add', name, value], { cwd })
// }
//
// /**
//  * Get a Git config setting.
//  *
//  * @param {string} cwd The CWD of the Git repository.
//  * @param {string} name Config name.
//  * @returns {Promise<void>} Promise that resolves when done.
//  */
// export const gitGetConfig = (cwd: string, name: string): string => {
//   // Check params.
//   check(cwd, 'cwd: absolute')
//   check(name, 'name: string+')
//
//   // Run command.
//   return execa.sync('git', ['config', name], { cwd }).stdout
// }
