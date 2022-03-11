import {formatFlags, parseFlags, tpl} from '../../../main/ts'

describe('index', () => {
  it('properly exports its inners', () => {
    const utils = [formatFlags, parseFlags, tpl]

    utils.forEach((method) => expect(method).toEqual(expect.any(Function)))
  })
})
