import { Debugger } from '@qiwi/semrel-plugin-creator'
import { gitCreateFakeRepo } from '@qiwi/semrel-testing-suite'
import execa from 'execa'
import fs from 'node:fs'
import path, { dirname} from 'node:path'
import { fileURLToPath } from 'node:url'
import tempy from 'tempy'

import { perform, push, TActionOptionsNormalized } from '../../main/ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const fixtures = path.resolve(__dirname, '../fixtures')

describe('actions', () => {
  const user = { name: 'Foo Bar', email: 'foo@bar.com' }

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
      const { url: repo } = gitCreateFakeRepo({
        sync: true,
        commits: [
          {
            message: 'feat: initial commit',
            from: `${fixtures}/basicPackage/`,
          },
        ],
      })
      const opts: TActionOptionsNormalized = {
        branch: 'master',
        from: '.',
        to,
        repo,
        cwd,
        temp: tempy.directory(),
        debug: console.log as Debugger,
        user,
        message: 'update meta',
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
    it('pushes files to remote', async () => {
      const cwd = `${fixtures}/foo/`
      const { cwd: _cwd, url: repo } = gitCreateFakeRepo({
        sync: true,
        commits: [
          {
            message: 'feat: initial commit',
            from: `${fixtures}/basicPackage/`,
          },
        ],
      })
      const opts = {
        cwd,
        temp: tempy.directory(),
        branch: 'metabranch',
        from: ['bar', 'unknown'],
        to: 'baz',
        repo,
        debug: console.log as Debugger,
        message: 'update meta',
        user,
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
      const { url: repo, cwd: _cwd } = gitCreateFakeRepo({
        sync: true,
        commits: [
          {
            message: 'feat: initial commit',
            from: `${fixtures}/basicPackage/`,
          },
        ],
      })
      const debug = console.log as Debugger
      const message = 'update meta'
      const opts0 = {
        cwd,
        temp: tempy.directory(),
        branch: 'metabranch',
        from: 'bar',
        to: 'scope',
        repo,
        debug,
        user,
        message,
      }
      const opts1 = {
        cwd,
        temp: tempy.directory(),
        branch: 'metabranch',
        from: 'foo',
        to: 'scope',
        repo,
        debug,
        user,
        message,
      }
      const opts2 = {
        cwd,
        temp: tempy.directory(),
        branch: 'metabranch',
        from: 'baz',
        to: 'scope',
        repo,
        debug,
        user,
        message,
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
          .readFileSync(path.join(_cwd, 'scope', 'foofoo.txt'), {
            encoding: 'utf8',
          })
          .trim(),
      ).toBe('foofoo')
      expect(
        fs
          .readFileSync(path.join(_cwd, 'scope', 'foobar.txt'), {
            encoding: 'utf8',
          })
          .trim(),
      ).toBe('foobar')
      expect(
        fs
          .readFileSync(path.join(_cwd, 'scope', 'foobaz.txt'), {
            encoding: 'utf8',
          })
          .trim(),
      ).toBe('foobaz')
    })
  })
})
