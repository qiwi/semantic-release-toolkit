const config = require('../../main/js')

describe('@qiwi/semrel-config-monorepo', () => {
  it('is not empty', () => {
    expect(config).not.toBeUndefined()
    expect(config).toEqual(require('../../../target/es5'))
  })
})
