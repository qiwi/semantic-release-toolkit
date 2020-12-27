import {
  TPlugin,
  TPluginConfig,
  TPluginFactory,
  TPluginFactoryOptions,
  TPluginFactoryOptionsNormalized,
  TReleaseHandler,
  TReleaseStep,
  TSemrelContext,
} from './interface'

export * from './interface'

export const releaseSteps: Array<TReleaseStep> = [
  'verifyConditions',
  'analyzeCommits',
  'verifyRelease',
  'generateNotes',
  'prepare',
  'publish',
  'success',
  'fail',
]

export const defaultOptions = {
  include: releaseSteps,
  exclude: [],
  handler: async (): Promise<void> => {
    /* async noop */
  },
}

export const normalizeOptions = (
  options: TReleaseHandler | TPluginFactoryOptions,
): TPluginFactoryOptionsNormalized => {
  if (typeof options === 'function') {
    return { ...defaultOptions, handler: options }
  }

  return { ...defaultOptions, ...options }
}

export const createPlugin: TPluginFactory = (options) => {
  const { handler, include, exclude } = normalizeOptions(options)

  return releaseSteps
    .filter((step) => include.includes(step) && !exclude.includes(step))
    .reduce<TPlugin>((m, step) => {
      m[step] = (pluginConfig: TPluginConfig, context: TSemrelContext) =>
        handler({ pluginConfig, context, step })

      return m
    }, {})
}
