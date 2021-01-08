import { fetch, TSyncOptions } from '../../main/ts'

describe('metabranch', () => {
  describe('fetch()', () => {
    it('clones files from remote to target dir', async () => {
      const opts: TSyncOptions = {
        branch: 'gh-pages',
        from: [],
        to: '/foo',
      }

      await fetch(opts)

      expect(fetch).toBe('bar')
    })
  })
})
