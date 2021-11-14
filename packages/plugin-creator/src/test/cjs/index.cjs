
const {createPlugin} = require('@qiwi/semrel-plugin-creator') // eslint-disable-line

describe('cjs', () => {
  it('createPlugin', () => {
    expect(createPlugin).toEqual(expect.any(Function))
  })
})
