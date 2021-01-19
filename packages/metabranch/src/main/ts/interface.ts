import { Debugger } from '@qiwi/semrel-plugin-creator'

export type TBaseActionOptions = {
  branch: string
  from: string | string[]
  to: string
  message: string
}

export type TActionOptionsNormalized = TBaseActionOptions & {
  debug: Debugger
  repo: string
  cwd: string
  temp: string
}

export type TActionType = 'fetch' | 'push'

export type TActionOptions = Partial<TActionOptionsNormalized> & {
  debug: Debugger
  repo: string
}

export type TPluginOptions = Partial<TBaseActionOptions> & {
  action: TActionType
}
