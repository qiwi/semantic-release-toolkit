import { gitStatus } from '../../main/ts'

describe('index', () => {
  it('properly exports its inners', () => {
    const gitMethods = [gitStatus]

    gitMethods.forEach((method) => expect(method).toEqual(expect.any(Function)))
  })
})
