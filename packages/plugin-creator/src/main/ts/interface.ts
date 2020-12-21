import {
  Context
} from 'semantic-release'

export type ReleaseType = 'patch' | 'minor' | 'major'

type PluginMethod<T = void> = (pluginOptions: Record<any, any>, ctx: Context) => Promise<T>

export interface Plugin {
  verifyConditions?: PluginMethod
  analyzeCommits?: PluginMethod<ReleaseType>
  verifyRelease?: PluginMethod
  generateNotes?: PluginMethod<string>
  prepare?: PluginMethod
  publish?: PluginMethod
  success?: PluginMethod
  fail?: PluginMethod
}

export type ReleaseStep = keyof Plugin

export type ReleaseHandler = (pluginOptions: Record<any, any>, ctx: Context, releaseStep: ReleaseStep) => Promise<any>

export type PluginFactory = (handler: ReleaseHandler) => Plugin
