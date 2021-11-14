import execa from 'execa'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  copyDirectory,
  gitAdd,
  gitCommit,
  gitCommitAll,
  gitGetTagHash,
  gitGetTags,
  gitInitOrigin,
  gitInitTestingRepo,
  gitPush,
  gitTag,
} from '../../../main/ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const fixtures = resolve(__dirname, '../../fixtures')

describe('gitInitOrigin()', () => {
  it('configures origin', () => {
    const sync = true
    const cwd = gitInitTestingRepo({ sync })
    copyDirectory(`${fixtures}/basicPackage/`, cwd)
    const commitId = gitCommitAll({
      cwd,
      message: 'feat: initial commit',
      sync,
    })
    const url = gitInitOrigin({ cwd, branch: 'release', sync })

    expect(url).toEqual(expect.any(String))
    expect(commitId).toEqual(expect.any(String))
    expect(
      execa.sync('git', ['remote', 'show', 'origin'], { cwd }).stdout,
    ).toMatch(/Remote branch:\n\s+release\s+tracked/)
    // ).toMatch(/master\s+tracked\n\s+release\s+tracked/)
  })
})

describe('gitAdd()', () => {
  it('adds files to git', () => {
    const sync = true
    const cwd = gitInitTestingRepo({ sync })
    copyDirectory(`${fixtures}/basicPackage/`, cwd)
    gitAdd({ cwd, sync, file: 'package.json' })
    const commitId = gitCommit({
      cwd,
      message: 'chore: add package.json',
      sync,
    })

    expect(commitId).toEqual(expect.any(String))
  })
})

describe('gitPush()', () => {
  it('pushes to remote', () => {
    const sync = true
    const cwd = gitInitTestingRepo({ sync })
    copyDirectory(`${fixtures}/basicPackage/`, cwd)
    gitCommitAll({ cwd, message: 'feat: initial commit', sync })
    gitInitOrigin({ cwd, sync }) // TODO insert to gitInitTestingRepo

    expect(() => gitPush({ cwd, sync })).not.toThrowError()
  })
})

describe('gitTag()', () => {
  it('adds tag to commit', () => {
    const sync = true
    const cwd = gitInitTestingRepo({ sync })
    const tag1 = 'foo@1.0.0'
    const tag2 = 'bar@1.0.0'
    copyDirectory(`${fixtures}/basicPackage/`, cwd)
    const commitId = gitCommitAll({
      cwd,
      message: 'feat: initial commit',
      sync,
    })

    gitTag({ cwd, tag: tag1, hash: commitId, sync })
    gitTag({ cwd, tag: tag2, hash: commitId, sync })
    gitInitOrigin({ cwd, sync })
    gitPush({ cwd, sync })

    const tagHash = gitGetTagHash({ cwd, tag: tag1, sync })
    const tags = gitGetTags({ cwd, hash: commitId, sync })

    expect(tagHash).toBe(commitId)
    expect(tags).toEqual([tag2, tag1])
  })
})
