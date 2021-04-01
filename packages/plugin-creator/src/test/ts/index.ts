import {
  createPlugin,
  defaultOptions,
  normalizeOptions,
  releaseSteps,
  TBranch,
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
    const name = 'fixtures.foobar'
    const options: TPluginFactoryOptions = {
      handler,
      include: ['fail'],
      exclude: ['success'],
      require: [],
      name,
      debug: 'scope',
    }

    expect(normalizeOptions(options)).toMatchObject({
      ...options,
      debug: expect.any(Function),
    })
  })

  it('uses `defaultOptions` otherwise', () => {
    expect(normalizeOptions({})).toMatchObject(defaultOptions)
  })

  it('resolves plugin`s pkg name', () => {
    expect(normalizeOptions({ name: 'foo' }).name).toBe('foo')
    expect(normalizeOptions({}).name).toMatch('semrel-plugin-')
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
    const pluginName = 'some-plugin'
    const plugin = createPlugin({ handler, name: pluginName })
    const pluginConfig = {}
    const branches = ['master']
    const branch: TBranch = {
      tags: [],
      type: 'release',
      name: 'master',
      range: '>1.0.0',
      accept: ['patch', 'minor', 'major'],
      main: true,
    }
    const context: TSemrelContext = {
      cwd: process.cwd(),
      branch,
      branches,
      logger: console,
      env: {},
      options: {
        branch,
        branches,
        repositoryUrl: 'url',
        tagFormat: '@${version}', // eslint-disable-line no-template-curly-in-string
        plugins: [['some-plugin', { a: 'b' }]],
        publish: [
          {
            path: 'some-plugin',
            foo: 'bar',
          },
          {
            path: 'other-plugin',
            bar: 'baz',
          },
        ],
      },
    }

    releaseSteps.forEach((step) => {
      ;(plugin[step] as TPluginMethod)(pluginConfig, context)

      expect(handler).toHaveBeenCalledWith({
        pluginConfig,
        context,
        step,
        stepConfig:
          step === 'publish'
            ? {
                path: 'some-plugin',
                foo: 'bar',
              }
            : undefined,
        stepConfigs: {
          verifyConditions: undefined,
          analyzeCommits: undefined,
          verifyRelease: undefined,
          generateNotes: undefined,
          prepare: undefined,
          publish: {
            path: 'some-plugin',
            foo: 'bar',
          },
          addChannel: undefined,
          success: undefined,
          fail: undefined,
        },
        debug: expect.any(Function),
      })
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
        cwd: process.cwd(),
        branch: {
          tags: [],
          type: 'release',
          name: 'master',
          range: '>1.0.0',
          accept: ['patch', 'minor', 'major'],
          main: true,
        },
        branches: ['master'],
        logger: console,
        env: {},
      }
      const verifyConditions = plugin.verifyConditions as TPluginMethod
      const analyzeCommits = plugin.analyzeCommits as TPluginMethod<string>
      const prepare = plugin.prepare as TPluginMethod
      const publish = plugin.publish as TPluginMethod

      expect(() => analyzeCommits(pluginConfig, context)).toThrowError(
        /^plugin 'semrel-plugin-\d{5}' requires verifyConditions to be invoked before analyzeCommits$/,
      )

      verifyConditions(pluginConfig, context)
      analyzeCommits(pluginConfig, context)

      expect(() => publish(pluginConfig, context)).toThrowError(
        /^plugin 'semrel-plugin-\d{5}' requires prepare to be invoked before publish$/,
      )

      prepare(pluginConfig, context)
      publish(pluginConfig, context)
    })
  })

  describe('metaContext', () => {
    it('is unique for each semrel context', () => {
      const plugin = createPlugin({ require: ['verifyConditions'] })
      const pluginConfig = {}
      const verifyConditions = plugin.verifyConditions as TPluginMethod
      const analyzeCommits = plugin.analyzeCommits as TPluginMethod<string>
      const context1: TSemrelContext = {
        cwd: process.cwd(),
        branch: {
          tags: [],
          type: 'release',
          name: 'master',
          range: '>1.0.0',
          accept: ['patch', 'minor', 'major'],
          main: true,
        },
        branches: ['master'],
        logger: console,
        env: {},
      }
      const context2: TSemrelContext = {
        cwd: process.cwd(),
        branch: {
          tags: [],
          type: 'release',
          name: 'master',
          range: '>1.0.0',
          accept: ['patch', 'minor', 'major'],
          main: true,
        },
        branches: ['master'],
        logger: console,
        env: {},
      }

      expect(() => analyzeCommits(pluginConfig, context1)).toThrowError(
        /^plugin 'semrel-plugin-\d{5}' requires verifyConditions to be invoked before analyzeCommits$/,
      )
      verifyConditions(pluginConfig, context1)
      analyzeCommits(pluginConfig, context1)

      expect(() => analyzeCommits(pluginConfig, context2)).toThrowError(
        /^plugin 'semrel-plugin-\d{5}' requires verifyConditions to be invoked before analyzeCommits$/,
      )
      verifyConditions(pluginConfig, context2)
      analyzeCommits(pluginConfig, context2)
    })
  })
})
