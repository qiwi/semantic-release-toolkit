import {Context} from 'semantic-release'

import {
  createPlugin,
  foo,
  releaseSteps,
  PluginMethod,
} from '../../main/ts'

describe('', () => {
  it('', () => {
    expect(foo).toBe('bar')
  })
})

describe('createPlugin', () => {
  it('factory returns a new plugin each time', () => {
    const handler: any = jest.fn()
    const plugin1 = createPlugin(handler)
    const plugin2 = createPlugin(handler)

    expect(plugin1).toBeInstanceOf(Object)
    expect(plugin2).toBeInstanceOf(Object)
    expect(plugin1).not.toBe(plugin2)
  })

  it('plugin properly invokes inner handler', () => {
    const handler: any = jest.fn()
    const plugin = createPlugin(handler)
    const pluginOptions = {}
    const ctx: Context = {
      logger: console,
      env: {}
    }

    releaseSteps.forEach((step) => {
      (plugin[step] as PluginMethod)(pluginOptions, ctx)

      expect(handler).toHaveBeenCalledWith(pluginOptions, ctx, step)
    })

    expect(handler).toBeCalledTimes(releaseSteps.length)
  })
})
