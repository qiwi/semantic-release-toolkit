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

  describe('fetch()', () => {
    it('clones files from remote to target dir', async () => {
      const cwd = tempy.directory()
      const to = 'foo/bar/baz'
      const { repo } = initTempRepo(`${fixtures}/basicPackage/`)
      const opts: TSyncOptions = {
        branch: 'gh-pages',
        from: '.',
        to,
        repo,
        cwd,
      }

      await fetch(opts)

      expect(fs.readFileSync(path.join(cwd, to, 'inner/file.txt'), {encoding: 'utf8'}).trim()).toBe('contents')
    })
  })

  describe('push()', () => {
    it('pushes files to remote', async () => {
      const cwd = `${fixtures}/foo/`
      const { repo, cwd: _cwd } = initTempRepo()
      const opts = {
        cwd,
        branch: 'metabranch',
        from: 'bar',
        to: 'baz',
        repo,
      }

      const commitId = await push(opts)

      await execa('git', ['fetch', 'origin', 'metabranch'], { cwd: _cwd })
      await execa('git', ['checkout', 'origin/metabranch'], { cwd: _cwd  })

      expect((await execa('git', ['rev-parse', 'HEAD'], { cwd: _cwd  })).stdout).toBe(commitId)
      expect(fs.readFileSync(path.join(_cwd, 'baz/bar', 'foobar.txt'), {encoding: 'utf8'}).trim()).toBe('foobar')
    })

    it('handles racing issues', async () => {
      const cwd = `${fixtures}/foo/`
      const { repo, cwd: _cwd } = initTempRepo()
      const opts0 = {
        cwd,
        branch: 'metabranch',
        from: 'bar',
        to: 'scope',
        repo,
      }
      const opts1 = {
        cwd,
        branch: 'metabranch',
        from: 'foo',
        to: 'scope',
        repo,
      }
      const opts2 = {
        cwd,
        branch: 'metabranch',
        from: 'baz',
        to: 'scope',
        repo,
      }

      await Promise.all([
        push(opts0),
        push(opts1),
        push(opts2),
      ])

      await execa('git', ['fetch', 'origin', 'metabranch'], { cwd: _cwd })
      await execa('git', ['checkout', 'origin/metabranch'], { cwd: _cwd  })

      expect(fs.readFileSync(path.join(_cwd, 'scope/foo', 'foofoo.txt'), {encoding: 'utf8'}).trim()).toBe('foofoo')
      expect(fs.readFileSync(path.join(_cwd, 'scope/bar', 'foobar.txt'), {encoding: 'utf8'}).trim()).toBe('foobar')
      expect(fs.readFileSync(path.join(_cwd, 'scope/baz', 'foobaz.txt'), {encoding: 'utf8'}).trim()).toBe('foobaz')
    })
  })
})
