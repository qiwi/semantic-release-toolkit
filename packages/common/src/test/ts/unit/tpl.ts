import { tpl } from '../../../main/ts'
import { jest } from '@jest/globals'

describe('tpl', () => {
  const error = jest.fn((...vars: any[]) => { console.log(vars) })
  const logger = {
    log (msg: string, ...vars: any[]) { console.log(vars || msg) },
    error
  }

  it('inject data to string', () => {
    expect(tpl('foo <%= bar %>', { bar: 'baz' }, logger)).toBe('foo baz')
  })

  it('returns template as is on failure', () => {
    const res = tpl('foo <%= bar.baz %>', { a: { b: 'c' } }, logger)

    expect(error).toHaveBeenCalledWith('lodash.template render failure', expect.any(Object))
    expect(res).toBe('foo <%= bar.baz %>')
  })
})
