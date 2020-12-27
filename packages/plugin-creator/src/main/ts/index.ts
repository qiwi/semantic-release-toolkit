import {
  TPlugin,
  TPluginConfig,
  TPluginFactory,
  TPluginFactoryOptions,
  TReleaseHandler,
  TReleaseStep,
  TSemrelContext
} from './interface'

export const foo = 'bar'

export * from './interface'

export const releaseSteps: Array<TReleaseStep> = [
  'verifyConditions',
  'analyzeCommits',
  'verifyRelease',
  'generateNotes',
  'prepare',
  'publish',
  'success',
  'fail'
]

export const defaultOptions = {
  include: releaseSteps,
  exclude: [],
  handler: async (): Promise<void> => { /* async noop */ }
}

export const normalizeOptions = (options: TReleaseHandler | TPluginFactoryOptions): TPluginFactoryOptions => {

  if (typeof options === 'function') {
    return {...defaultOptions, handler: options}
  }

  return {...defaultOptions, ...options}
}

export const createPlugin: TPluginFactory = (releaseHandler) =>
  releaseSteps.reduce<TPlugin>((m, step) => {
    m[step] = (pluginConfig: TPluginConfig, context: TSemrelContext) =>
      releaseHandler({pluginConfig, context, step})

    return m
  }, {})

