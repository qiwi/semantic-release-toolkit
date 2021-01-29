import { Debugger } from '@qiwi/semrel-plugin-creator'

export interface IGitCommon {
  cwd: string
  sync?: boolean
  debug?: Debugger
}

export type TGitExecContext = IGitCommon & {
  cmd: string
  args?: any[]
}

export interface IGitConfigAdd extends IGitCommon {
  key: string
  value: any
}

export interface IGitConfigGet extends IGitCommon {
  key: string
}

export interface IGitInit {
  cwd?: string
  sync?: boolean
}

export interface IGitCheckout extends IGitCommon {
  branch: string
  b?: boolean
  f?: boolean
}
