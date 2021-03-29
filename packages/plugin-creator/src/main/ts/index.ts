import debugFactory, { Debugger } from 'debug'
import { castArray } from 'lodash'
import { readPackageUpSync as readPkgUp } from 'read-pkg-up8'

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
  'addChannel',
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
  name: String(readPkgUp({ cwd: module?.parent?.filename })?.packageJson?.name),
}

const createDebugger = (scope: string | Debugger): Debugger => {
  if (typeof scope === 'string') {
    return debugFactory(scope)
  }

  return scope
}

export const normalizeOptions = (
  options: TReleaseHandler | TPluginFactoryOptions,
): TPluginFactoryOptionsNormalized => {
  const preOptions =
    typeof options === 'function' ? { handler: options } : options

  const debug = createDebugger(preOptions.debug || defaultOptions.name)

  return { ...defaultOptions, ...preOptions, debug }
}

const checkPrevSteps = (
  { invoked }: TPluginMetaContext,
  { name, require }: TPluginFactoryOptionsNormalized,
  step: TReleaseStep,
): void => {
  if (require.length === 0) {
    return
  }

  const prevSteps = releaseSteps.slice(0, releaseSteps.indexOf(step))
  const missedStep = prevSteps.find(
    (step) => require.includes(step) && !invoked.includes(step),
  )

  if (missedStep) {
    throw new Error(
      `plugin '${name}' requires ${missedStep} to be invoked before ${step}`,
    )
  }
}

export const getStepConfig = (
  context: TSemrelContext,
  step: TReleaseStep,
  name = '',
): TPluginConfig | undefined =>
  castArray(context.options?.[step])
    .map((config) => {
      if (Array.isArray(config)) {
        const [path, opts] = config

        return { ...opts, path }
      }

      return config
    })
    .find((config) => config?.path === name)

export const getStepConfigs = (
  context: TSemrelContext,
  name = '',
): Record<TReleaseStep, TPluginConfig | undefined> =>
  releaseSteps.reduce<Record<TReleaseStep, TPluginConfig | undefined>>(
    (configs, step) => {
      configs[step] = getStepConfig(context, step, name)

      return configs
    },
    {} as Record<TReleaseStep, TPluginConfig | undefined>,
  )

const metaContexts: WeakMap<TSemrelContext, TPluginMetaContext> = new WeakMap()

const getMetaContext = (context: TSemrelContext): TPluginMetaContext => {
  let metaContext = metaContexts.get(context)

  if (!metaContext) {
    metaContext = {
      invoked: [],
    }
    metaContexts.set(context, metaContext)
  }

  return metaContext
}

export const createPlugin: TPluginFactory = (options) => {
  const normalizedOpions = normalizeOptions(options)
  const { handler, include, exclude, name, debug } = normalizedOpions

  return releaseSteps
    .filter((step) => include.includes(step) && !exclude.includes(step))
    .reduce<TPlugin>((m, step) => {
      m[step] = (pluginConfig: TPluginConfig, context: TSemrelContext) => {
        const metaContext = getMetaContext(context)

        checkPrevSteps(metaContext, normalizedOpions, step)

        metaContext.invoked.push(step)

        const stepConfigs = getStepConfigs(context, name)
        const stepConfig = stepConfigs[step]

        return handler({
          pluginConfig,
          context,
          step,
          stepConfig,
          stepConfigs,
          debug,
        })
      }

      return m
    }, {})
}
