import { Context } from 'semantic-release'

export type TSemrelContext = Context

export type TReleaseType = 'patch' | 'minor' | 'major'

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
  success?: TPluginMethod
  fail?: TPluginMethod
}

export type TReleaseStep = keyof TPlugin

export type TPluginHandlerContext = {
  pluginConfig: TPluginConfig
  context: TSemrelContext
  step: TReleaseStep
}

export type TReleaseHandler = (context: TPluginHandlerContext) => Promise<any>

export type TPluginFactoryOptionsNormalized = {
  handler: TReleaseHandler
  name?: string
  include: TReleaseStep[]
  exclude: TReleaseStep[]
}

export type TPluginFactoryOptions = Partial<TPluginFactoryOptionsNormalized>

export type TPluginFactory = (
  handler: TPluginFactoryOptions | TReleaseHandler,
) => TPlugin
