import {createPlugin} from '@qiwi/semrel-plugin-creator'

describe('esm/mjs', () => {
  it('createPlugin', () => {
    expect(createPlugin).toEqual(expect.any(Function))
  })
})
