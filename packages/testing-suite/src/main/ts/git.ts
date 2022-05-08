import { gitRoot } from '@antongolub/git-root'
import {
  exec,
  format,
  gitAddAll,
  gitCheckout,
  gitCommit,
  gitConfigAdd,
  gitExec,
  gitInit,
  gitInitOrigin,
  gitInitRemote,
  gitPush,
  gitRemoteAdd,
  gitSetUser,
  gitTag,
  IGitCommit,
  IGitInit,
  TGitResult,
} from '@qiwi/git-utils'
import { ICallable } from '@qiwi/substrate'
import { temporaryDirectory } from 'tempy'

import { copyDirectory } from './file'

export * from '@qiwi/git-utils'

export type TGitCommitDigest = {
  message: string
  from?: string
  tag?: string
  branch?: string
}

export interface IGitInitTestingRepo extends IGitInit {
  branch?: string
  commits?: TGitCommitDigest[]
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
  commits,
}: T): TGitResult<T['sync']> => {
  const cwd = temporaryDirectory()

  return exec(
    () => gitInit({ sync, cwd }),
    () => gitSetUser({ sync, cwd, name: 'Foo Bar', email: 'foo@bar.com' }),
    () =>
      gitCheckout({
        cwd,
        sync,
        branch,
        b: true,
      }),
    // Disable GPG signing for commits.
    () => gitConfigAdd({ cwd, sync, key: 'commit.gpgsign', value: false }),
    () => gitCreateFakeCommits({ sync, cwd, commits }),
    () => gitInitOrigin({ cwd, sync }),
    // () => gitPush({ cwd, sync }),
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

export interface IGitFakeRepo extends IGitInit {
  commits: TGitCommitDigest[]
}

export type TGitFakeCommitsDigest = {
  commits: string[]
}

export type TGitFakeRepoDigest = TGitFakeCommitsDigest & {
  cwd: string
  url: string
}

export interface IGitPushFakeCommits {
  cwd: string
  sync?: boolean
  commits?: TGitCommitDigest[]
}

export const gitCreateFakeCommits = <T extends IGitPushFakeCommits>({
  commits = [{ message: 'empty commit' }],
  sync,
  cwd,
}: T): TGitResult<T['sync'], TGitFakeCommitsDigest> => {
  const res: TGitFakeCommitsDigest = {
    commits: [],
  }

  return exec(
    ...commits.reduce<ICallable[]>(
      (
        cb,
        { message = 'feat: initial commit', from, tag, branch = 'master' },
      ) => {
        cb.push(
          () => gitCheckout({ cwd, sync, branch, b: true }),
          () => from && copyDirectory(from, cwd),
          () =>
            gitCommitAll({
              cwd,
              message,
              sync,
            }),
          (commit) => {
            res.commits.push(commit)
          },
          (commit) => {
            if (tag) {
              return gitTag({ cwd, tag, hash: commit, sync })
            }
          },
        )
        return cb
      },
      [],
    ),
    () => format(sync as T['sync'], res),
  )
}

export const gitPushFakeCommits = <T extends IGitPushFakeCommits>({
  commits,
  sync,
  cwd,
}: T): TGitResult<T['sync'], TGitFakeCommitsDigest> => {
  let _res: TGitFakeCommitsDigest

  return exec(
    () => gitCreateFakeCommits({ cwd, sync, commits }),
    (res) => {
      _res = res
      if (res.commits.length > 0) {
        return gitPush({ cwd, sync })
      }
    },
    () => format(sync as T['sync'], _res),
  )
}

export const gitCreateFakeRepo = <T extends IGitFakeRepo>({
  sync,
  commits,
}: T): TGitResult<T['sync'], TGitFakeRepoDigest> => {
  const cwd = temporaryDirectory()
  const res: TGitFakeRepoDigest = {
    cwd,
    url: '',
    commits: [],
  }

  return exec(
    () => gitInit({ sync, cwd }),
    () => gitConfigAdd({ cwd, sync, key: 'commit.gpgsign', value: false }),
    () => gitSetUser({ sync, cwd, name: 'Foo Bar', email: 'foo@bar.com' }),
    () => gitInitRemote({ sync }),
    (url: string) => {
      res.url = url
    },
    () => gitRemoteAdd({ sync, cwd, url: res.url }),
    () => gitPushFakeCommits({ commits, sync, cwd }),
    ({ commits }) => format(sync as T['sync'], { ...res, commits }),
  )
}

export interface IGitClone {
  cwd?: string
  sync?: boolean
  url: string
}

export const gitClone = <T extends IGitClone>({
  cwd = temporaryDirectory(),
  sync,
  url,
}: T): TGitResult<T['sync']> =>
  exec(
    () => gitRoot(cwd, sync),
    (parentGitDir: string) => {
      if (parentGitDir) {
        throw new Error(
          `${cwd} belongs to repo ${parentGitDir as string} already`,
        )
      }
    },
    () =>
      gitExec({
        cwd: cwd as string,
        sync,
        args: ['clone', url, cwd],
      }),
    () => format(sync as T['sync'], cwd),
  )
