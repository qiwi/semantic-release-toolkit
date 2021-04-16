export type TReleaseType = 'patch' | 'minor' | 'major'
export type TReleasePattern = TReleaseType | 'any' | '*'
export type TReleaseResolution = TReleaseType | 'inherit' | 'none' | false | null | undefined

export type TPackageName = string

export type TDependencyTypeNormalized = 'prod' | 'dev' | 'peer' | 'optional'
export type TDependencyType = TDependencyTypeNormalized | 'any' | 'opt'

export type TBumperRules = Record<TPackageName, {
  patch: TReleaseType | null
  minor: TReleaseType | null
  major: TReleaseType | null
}>

export type TBumperDirective = {
  dependencyType: TDependencyType,
  packages?: string | string[],
  releaseMap: Partial<Record<TReleasePattern, TReleaseResolution>>
}

export type TBumperConfig = TBumperDirective | TBumperDirective[]
