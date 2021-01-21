import { Debugger } from '@qiwi/semrel-plugin-creator'
import {
  copyDirectory,
  gitCommitAll,
  gitInit,
  gitInitOrigin,
  gitPush,
} from '@qiwi/semrel-testing-suite'
import execa from 'execa'
import fs from 'fs'
import path from 'path'
import tempy from 'tempy'

import { perform, push, TActionOptions } from '../../main/ts'

const fixtures = path.resolve(__dirname, '../fixtures')

describe('actions', () => {
  const initTempRepo = (
    fixture = `${fixtures}/basicPackage/`,
  ): { cwd: string; repo: string } => {
    const cwd = gitInit()
    copyDirectory(fixture, cwd)
    gitCommitAll(cwd, 'feat: initial commit')
    const repo = gitInitOrigin(cwd)
    gitPush(cwd)

    return {
      cwd,
      repo,
    }
  }

  describe('perform()', () => {
    it('Throws an error on unsupported action', () => {
      // @ts-ignore
      return expect(perform('foo', {})).rejects.toThrowError(
        /unsupported action 'foo'/,
      )
    })
  })

  describe('fetch()', () => {
    it('clones files from remote to target dir', async () => {
      const cwd = tempy.directory()
      const to = 'foo/bar/baz'
      const { repo } = initTempRepo(`${fixtures}/basicPackage/`)
      const opts: TActionOptions = {
        branch: 'master',
        from: '.',
        to,
        repo,
        cwd,
        debug: console.log as Debugger,
      }

      await perform('fetch', opts)

      expect(
        fs
          .readFileSync(path.join(cwd, to, 'inner/file.txt'), {
            encoding: 'utf8',
          })
          .trim(),
      ).toBe('contents')
    })
  })

  describe('push()', () => {
    fit('pushes files to remote', async () => {
      const cwd = `${fixtures}/foo/`
      const { repo, cwd: _cwd } = initTempRepo()
      const opts = {
        cwd,
        branch: 'metabranch',
        from: ['bar', 'unknown'],
        to: 'baz',
        repo,
        debug: console.log as Debugger,
      }

      const commitId = await perform('push', opts)

      await execa('git', ['fetch', 'origin', 'metabranch'], { cwd: _cwd })
      await execa('git', ['checkout', 'origin/metabranch'], { cwd: _cwd })

      expect(
        (await execa('git', ['rev-parse', 'HEAD'], { cwd: _cwd })).stdout,
      ).toBe(commitId)
      expect(
        fs
          .readFileSync(path.join(_cwd, 'baz', 'foobar.txt'), {
            encoding: 'utf8',
          })
          .trim(),
      ).toBe('foobar')
    })

    it('handles racing issues', async () => {
      const cwd = `${fixtures}/foo/`
      const { repo, cwd: _cwd } = initTempRepo()
      const debug = console.log as Debugger
      const opts0 = {
        cwd,
        branch: 'metabranch',
        from: 'bar',
        to: 'scope',
        repo,
        debug,
      }
      const opts1 = {
        cwd,
        branch: 'metabranch',
        from: 'foo',
        to: 'scope',
        repo,
        debug,
      }
      const opts2 = {
        cwd,
        branch: 'metabranch',
        from: 'baz',
        to: 'scope',
        repo,
        debug,
      }

      const pushedCommits = await Promise.all([
        push(opts0),
        push(opts1),
        push(opts2),
      ])

      await execa('git', ['fetch', 'origin', 'metabranch'], { cwd: _cwd })
      await execa('git', ['checkout', 'origin/metabranch'], { cwd: _cwd })
      const commits = (
        await execa('git', ['log', '--pretty=%H', 'origin/metabranch'], {
          cwd: _cwd,
        })
      ).stdout.split('\n')

      expect(pushedCommits.every((hash) => commits.includes(hash))).toBeTruthy()
      expect(
        fs
          .readFileSync(path.join(_cwd, 'scope/foo', 'foofoo.txt'), {
            encoding: 'utf8',
          })
          .trim(),
      ).toBe('foofoo')
      expect(
        fs
          .readFileSync(path.join(_cwd, 'scope/bar', 'foobar.txt'), {
            encoding: 'utf8',
          })
          .trim(),
      ).toBe('foobar')
      expect(
        fs
          .readFileSync(path.join(_cwd, 'scope/baz', 'foobaz.txt'), {
            encoding: 'utf8',
          })
          .trim(),
      ).toBe('foobaz')
    })
  })
})
