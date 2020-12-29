import { sync as readPkgUp } from 'read-pkg-up'

import {
  TPlugin,
  TPluginConfig,
  TPluginFactory,
  TPluginFactoryOptions,
  TPluginFactoryOptionsNormalized,
  TPluginMetaContext,
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
  require: [],
  handler: async (): Promise<void> => {
    /* async noop */
  },
  name: String(readPkgUp({ cwd: module?.parent?.filename })?.packageJson?.name)
}

export const normalizeOptions = (
  options: TReleaseHandler | TPluginFactoryOptions,
): TPluginFactoryOptionsNormalized => {
  const preOptions =
    typeof options === 'function' ? { handler: options } : options

  return { ...defaultOptions, ...preOptions }
}

const checkPrevSteps = ({invoked}: TPluginMetaContext, {name, require}: TPluginFactoryOptionsNormalized, step: TReleaseStep): void => {
  if (require.length === 0) {
    return
  }

  const prevSteps = releaseSteps.slice(0, releaseSteps.indexOf(step))
  const missedStep = prevSteps.find(step => require.includes(step) && !invoked.includes(step))

  if (missedStep) {
    throw new Error(`plugin '${name}' requires ${missedStep} to be invoked before ${step}`)
  }
}

export const createPlugin: TPluginFactory = (options) => {
  const normalizedOpions = normalizeOptions(options)
  const { handler, include, exclude } = normalizedOpions
  const metaContext: TPluginMetaContext = {
    invoked: []
  }

  return releaseSteps
    .filter((step) => include.includes(step) && !exclude.includes(step))
    .reduce<TPlugin>((m, step) => {
      m[step] = (pluginConfig: TPluginConfig, context: TSemrelContext) => {
        checkPrevSteps(metaContext, normalizedOpions, step)

        metaContext.invoked.push(step)

        return handler({ pluginConfig, context, step })
      }

      return m
    }, {})
}
