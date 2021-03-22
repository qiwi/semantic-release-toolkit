import { foo } from '../../../main/ts'

describe('export', () => {
  it('`foo` defined', () => {
    expect(foo).toBe('bar')
  })
})
