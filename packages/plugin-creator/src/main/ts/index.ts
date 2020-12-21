import {Plugin, PluginFactory, ReleaseStep, ReleaseType} from './interface'
import {Context} from "semantic-release";

export const foo = 'bar'

export * from './interface'

const releaseSteps: Array<ReleaseStep> = [
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
    m[v] = (pluginOptions: Record<any, any>, ctx: Context) => {
      return releaseHandler(pluginOptions, ctx, v)
    }

    return m
  }, {})

