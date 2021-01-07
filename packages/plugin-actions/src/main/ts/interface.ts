export interface TAction {
  provider: string
  options: Record<string, any>
}

export type TActions = Array<TAction>

export type TPluginConfig = {
  actions: TActions
}
