import {Context} from 'semantic-release'

import {Plugin, PluginFactory, ReleaseStep} from './interface'

export const foo = 'bar'

export * from './interface'

export const releaseSteps: Array<ReleaseStep> = [
  'verifyConditions',
  'analyzeCommits',
  'verifyRelease',
  'generateNotes',
  'prepare',
  'publish',
  'success',
  'fail'
]

export const createPlugin: PluginFactory = (releaseHandler) =>
  releaseSteps.reduce<Plugin>((m, v) => {
    m[v] = (pluginOptions: Record<any, any>, ctx: Context) =>
      releaseHandler(pluginOptions, ctx, v)

    return m
  }, {})

