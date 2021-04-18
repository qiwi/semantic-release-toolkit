export type TReleaseType = 'patch' | 'minor' | 'major'
export type TReleasePattern = TReleaseType | 'any' | '*'
export type TReleaseRule = TReleaseType | 'inherit' | 'none' | false | null | undefined
export type TReleaseRuleMap = Partial<Record<TReleasePattern, TReleaseRule>>
export type TReleaseDirective = TReleaseRule | TReleaseRuleMap

export type TPackageName = string

export type TDependencyTypeNormalized = 'prod' | 'dev' | 'peer' | 'optional'
export type TDependencyType = TDependencyTypeNormalized | 'any' | 'all' | '*' | 'opt'

export type TBumperRules = Record<TPackageName, {
  patch: TReleaseType | null
  minor: TReleaseType | null
  major: TReleaseType | null
}>

export type TBumperDirective = {
  include: TPackageName | TPackageName[],
  deps: Array<{
    type: TDependencyType,
    include: TPackageName | TPackageName[],
    release: TReleaseDirective
  }>
}

export type TBumperConfig = TBumperDirective | TBumperDirective[]
