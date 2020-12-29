import {
  createPlugin,
  defaultOptions,
  normalizeOptions,
  releaseSteps,
  TPluginFactoryOptions,
  TPluginMethod,
  TSemrelContext,
} from '../../main/ts'

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
      require: [],
      name,
    }

    expect(normalizeOptions(options)).toEqual(options)
  })

  it('uses `defaultOptions` otherwise', () => {
    expect(normalizeOptions({})).toEqual(defaultOptions)
  })

  it('resolves plugin`s pkg name', () => {
    expect(normalizeOptions({ name: 'foo' }).name).toBe('foo')
    expect(normalizeOptions({}).name).toBe('@qiwi/semrel-plugin-creator')
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
      env: {},
    }

    releaseSteps.forEach((step) => {
      ;(plugin[step] as TPluginMethod)(pluginConfig, context)

      expect(handler).toHaveBeenCalledWith({ pluginConfig, context, step })
    })

    expect(handler).toBeCalledTimes(releaseSteps.length)
  })

  describe('options', () => {
    it('plugin exposes `included` methods only if option passed', () => {
      const plugin = createPlugin({ include: ['success', 'prepare'] })

      expect(Object.keys(plugin)).toEqual(['prepare', 'success'])
    })

    it('plugin omits `excluded` methods if option passed', () => {
      const plugin = createPlugin({ exclude: ['success', 'prepare'] })

      expect(Object.keys(plugin)).toEqual(
        releaseSteps.filter((step) => step !== 'success' && step !== 'prepare'),
      )
    })

    it('`require` option asserts that all plugin steps have been called', () => {
      const plugin = createPlugin({ require: ['verifyConditions', 'prepare'] })
      const pluginConfig = {}
      const context: TSemrelContext = {
        logger: console,
        env: {},
      }
      const verifyConditions = plugin.verifyConditions as TPluginMethod
      const analyzeCommits = plugin.analyzeCommits as TPluginMethod<string>
      const prepare = plugin.prepare as TPluginMethod
      const publish = plugin.publish as TPluginMethod

      expect(() => analyzeCommits(pluginConfig, context)).toThrowError(
        "plugin '@qiwi/semrel-plugin-creator' requires verifyConditions to be invoked before analyzeCommits",
      )

      verifyConditions(pluginConfig, context)
      analyzeCommits(pluginConfig, context)

      expect(() => publish(pluginConfig, context)).toThrowError(
        "plugin '@qiwi/semrel-plugin-creator' requires prepare to be invoked before publish",
      )

      prepare(pluginConfig, context)
      publish(pluginConfig, context)
    })
  })
})
