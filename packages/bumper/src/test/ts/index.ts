import { foo } from '../../main/ts'

describe('index', () => {
  it('properly exports its inners', () => {
    expect(foo).toBe('bar')
  })
})
