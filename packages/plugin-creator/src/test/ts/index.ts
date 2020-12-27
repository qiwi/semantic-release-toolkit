import {
  createPlugin,
  defaultOptions,
  foo,
  normalizeOptions,
  releaseSteps, TPluginFactoryOptions,
  TPluginMethod,
  TSemrelContext,
} from '../../main/ts'

describe('', () => {
  it('', () => {
    expect(foo).toBe('bar')
  })
})

describe('normalizeOptions()', () => {
  it('handles fn as input', () => {
    const handler: any = jest.fn()
    expect(normalizeOptions(handler).handler).toBe(handler)
  })

  it('merges `defaultOptions` with passed opts', () => {
    const handler: any = jest.fn()
    const name = 'foobar'
    const options: TPluginFactoryOptions = {
      handler,
      include: ['fail'],
      exclude: ['success'],
      name
    }

    expect(normalizeOptions(options)).toEqual(options)
  })

  it('uses `defaultOptions` otherwise', () => {
    expect(normalizeOptions({})).toEqual(defaultOptions)
  })
})

describe('createPlugin()', () => {
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
    const pluginConfig = {}
    const context: TSemrelContext = {
      logger: console,
      env: {}
    }

    releaseSteps.forEach((step) => {
      (plugin[step] as TPluginMethod)(pluginConfig, context)

      expect(handler).toHaveBeenCalledWith({pluginConfig, context, step})
    })

    expect(handler).toBeCalledTimes(releaseSteps.length)
  })
})
