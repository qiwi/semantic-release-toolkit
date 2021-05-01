export type TReleaseType = 'patch' | 'minor' | 'major'
export type TReleaseRule = TReleaseType | 'inherit' | 'none' | 'off' | false | null | undefined
export type TReleaseRuleMap = Partial<Record<TReleaseType, TReleaseType>>
export type TReleaseDirective = TReleaseRule | TReleaseRuleMap

export type TPackageName = string
export type TPackageVersion = string
export type IPackageDeps = Record<TPackageName, TPackageVersion>
export type IPackage = {
  name: string
  version: TPackageVersion
  dependencies?: IPackageDeps
  devDependencies?: IPackageDeps
  peerDependencies?: IPackageDeps
  optionalDependencies?: IPackageDeps
}

export type TDependencyTypeNormalized = 'prod' | 'dev' | 'peer' | 'optional'
export type TDependencyType = TDependencyTypeNormalized | 'any' | 'all' | '*' | 'opt'

export type TBumperRules = Record<TPackageName, Record<TPackageName, {[key in TDependencyTypeNormalized]?: {
  [key in TReleaseType]?: TReleaseType
}}>>

export type TBumperStrategy = 'override' | 'satisfy' | 'inherit'

export type TBumperDeclaration = {
  include: TPackageName | TPackageName[]
  deps: Array<{
    type: TDependencyType | TDependencyType[]
    include: TPackageName | TPackageName[]
    release: TReleaseDirective
    strategy: TBumperStrategy
  }>
}

export type TBumperConfig = TBumperDeclaration | TBumperDeclaration[]

export type TBumperDirectives = Record<TPackageName, Record<TPackageName, Record<TReleaseType, TReleaseType>>>
