import { gitClone } from '../../../main/ts'

describe('export', () => {
  it('`gitClone` is defined', () => {
    expect(gitClone).toEqual(expect.any(Function))
  })
})
