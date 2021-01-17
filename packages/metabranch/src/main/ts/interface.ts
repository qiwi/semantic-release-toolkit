export type TBaseActionOptions = {
  branch: string
  from: string | string[]
  to: string
  message: string
}

export type TActionOptionsNormalized = TBaseActionOptions & {
  repo: string
  cwd: string
  temp: string
}

export type TActionType = 'fetch' | 'push'

export type TActionOptions = Partial<TActionOptionsNormalized> & { repo: string }

export type TPluginOptions = Partial<TBaseActionOptions> & { action: TActionType }
