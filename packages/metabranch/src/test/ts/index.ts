import { fetch, TSyncOptions, push } from '../../main/ts'
import {copyDirectory, gitCommitAll, gitInit, gitInitOrigin, gitPush} from '@qiwi/semrel-testing-suite'
import path from 'path'
import tempy from 'tempy'
import fs from 'fs'
import execa from 'execa'

const fixtures = path.resolve(__dirname, '../fixtures')

describe('metabranch', () => {
  const initTempRepo = (fixture = `${fixtures}/basicPackage/`): { cwd: string, repo: string } => {
    const cwd = gitInit()
    copyDirectory(fixture, cwd)
    gitCommitAll(cwd, 'feat: initial commit')
    const repo = gitInitOrigin(cwd)
    gitPush(cwd)

    return {
      cwd,
      repo
    }
  }

  xdescribe('fetch()', () => {
    it('clones files from remote to target dir', async () => {
      const to = path.join(tempy.directory(), )
      const { repo } = initTempRepo()
      const opts: TSyncOptions = {
        branch: 'gh-pages',
        from: '.',
        to,
        repo
      }

      await fetch(opts)

      expect(fs.readFileSync(path.join(to, 'package.json'), {encoding: 'utf8'})).toBe('bar')
    })
  })

  describe('push()', () => {
    it('pushes files to remote', async () => {
      const { repo, cwd } = initTempRepo(path.resolve(fixtures, 'foo'))
      const from = path.resolve(cwd, 'bar')
      const opts = {
        branch: 'metabranch',
        from,
        to: 'foo',
        repo,
        base: cwd
      }

      const commitId = await push(opts)

      await execa('git', ['fetch', 'origin', 'metabranch'], { cwd })
      await execa('git', ['checkout', 'origin/metabranch'], { cwd })

      expect((await execa('git', ['rev-parse', 'HEAD'], { cwd })).stdout).toBe(commitId)
      expect(fs.readFileSync(path.join(cwd, 'foo', 'bar', 'foobar.txt'), {encoding: 'utf8'}).trim()).toBe('foobar')
    })
  })
})
