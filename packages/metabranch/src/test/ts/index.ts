import { fetch, TSyncOptions } from '../../main/ts'
import {copyDirectory, gitCommitAll, gitInit, gitInitOrigin, gitPush} from "@qiwi/semrel-testing-suite"
import path from 'path'
import tempy from 'tempy'
import fs from 'fs'

const fixtures = path.resolve(__dirname, '../fixtures')

describe('metabranch', () => {
  describe('fetch()', () => {
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
})
