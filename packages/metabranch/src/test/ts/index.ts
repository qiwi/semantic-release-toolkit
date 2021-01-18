import def, { plugin } from '../../main/ts'

describe('index', () => {
  it('properly exports its inners', () => {
    expect(plugin).toBe(def)
  })
})
