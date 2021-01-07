import def, { plugin } from '../../main/ts'

describe('export', () => {
  it('`plugin` defined', () => {
    expect(plugin).toEqual(expect.any(Object))
  })

  it('`default` equals `plugin`', () => {
    expect(def).toBe(plugin)
  })
})
