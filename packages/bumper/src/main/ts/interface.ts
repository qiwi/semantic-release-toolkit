export type TReleaseType = 'patch' | 'minor' | 'major'
export type TReleaseRule = TReleaseType | 'inherit' | 'none' | 'off' | false | null | undefined
export type TReleaseRuleMap = Partial<Record<TReleaseType, TReleaseType>>
export type TReleaseDirective = TReleaseRule | TReleaseRuleMap

export type TPackageName = string

export type TDependencyTypeNormalized = 'prod' | 'dev' | 'peer' | 'optional'
export type TDependencyType = TDependencyTypeNormalized | 'any' | 'all' | '*' | 'opt'

export type TBumperRules = Record<TPackageName, Record<TPackageName, {[key in TDependencyTypeNormalized]?: {
  [key in TReleaseType]?: TReleaseType
}}>>

export type TBumperDirective = {
  include: TPackageName | TPackageName[],
  deps: Array<{
    type: TDependencyType,
    include: TPackageName | TPackageName[],
    release: TReleaseDirective
  }>
}

export type TBumperConfig = TBumperDirective | TBumperDirective[]
