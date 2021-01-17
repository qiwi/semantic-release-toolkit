import { Context } from 'semantic-release'

export type TReleaseType = 'patch' | 'minor' | 'major'

export type TBranch = {
  channel?: string
  tags: string[]
  type: string
  name: string
  range: string
  accept: TReleaseType[]
  main: boolean
}

export type TSemrelContext = Context & {
  cwd: string
  branch?: TBranch
  branches: string[]
}

export type TPluginConfig = Record<any, any>

export type TPluginMethod<T = void> = (
  pluginConfig: TPluginConfig,
  context: TSemrelContext,
) => Promise<T>

export interface TPlugin {
  verifyConditions?: TPluginMethod
  analyzeCommits?: TPluginMethod<TReleaseType>
  verifyRelease?: TPluginMethod
  generateNotes?: TPluginMethod<string>
  prepare?: TPluginMethod
  publish?: TPluginMethod
  addChannel?: TPluginMethod
  success?: TPluginMethod
  fail?: TPluginMethod
}

export type TReleaseStep = keyof TPlugin

export type TStepConfigs = Record<TReleaseStep, TPluginConfig>

export type TPluginHandlerContext = {
  pluginConfig: TPluginConfig
  stepConfig: TPluginConfig
  stepConfigs: TStepConfigs
  context: TSemrelContext
  step: TReleaseStep
}

export type TReleaseHandler = (context: TPluginHandlerContext) => Promise<any>

export type TPluginFactoryOptionsNormalized = {
  handler: TReleaseHandler
  name?: string
  include: TReleaseStep[]
  exclude: TReleaseStep[]
  require: TReleaseStep[]
}

export type TPluginFactoryOptions = Partial<TPluginFactoryOptionsNormalized>

export type TPluginFactory = (
  handler: TPluginFactoryOptions | TReleaseHandler,
) => TPlugin

export type TPluginMetaContext = {
  invoked: TReleaseStep[]
}
