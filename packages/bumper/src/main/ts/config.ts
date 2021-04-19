import { readFileSync as read } from 'fs'

import { sync as globby } from 'globby'

import {
  TBumperConfig, TBumperRules, TDependencyType, TDependencyTypeNormalized,
  TPackageName, TReleaseDirective, TReleaseRuleMap, TReleaseType
} from './interface'

const asArray = <T>(value: T): T extends any[] ? T : T[] => (Array.isArray(value) ? value: [value]) as T extends any[] ? T : T[]


export const readPackagesNamesFromGlobs = (globs: string[], cwd: string): string[] =>
  globby(globs.map(p => p.replace(/\/package\.json$/, '') + '/package.json'), { cwd, absolute: true, onlyFiles: true })
    .map(file => JSON.parse(read(file, { encoding: 'utf8' })).name)

export const resolvePackageNames = (targets: TPackageName | TPackageName[], cwd: string): TPackageName[] => {
  const globlikePattern = /[!*]/gi
  const {pkgs, globs} = asArray(targets)
    .reduce((memo, val) => {
      if (globlikePattern.test(val)) {
        memo.globs.push(val)
      } else {
        memo.pkgs.push(val)
      }

      return memo
    }, {pkgs: [] as string[], globs: [] as string[]})

  return [...pkgs, ...readPackagesNamesFromGlobs(globs, cwd)]
}

const pushUnique = <T extends any[]>(target: T, ...elements: any[]): T => {
  elements.forEach(e => {
    if (!target.includes(e)) {
      target.push(e)
    }
  })

  return target
}

export const normalizeDepType = (types: TDependencyType[]): TDependencyTypeNormalized[] =>
  types.reduce((m, t) => {
    switch (t) {
      case 'any':
      case 'all':
      case '*':
        return pushUnique(m, 'prod', 'dev', 'peer', 'optional')
      case 'opt':
        return pushUnique(m, 'optional')
      default:
        return pushUnique(m, t)
    }
  }, [])

export const normalizeReleaseType = (release: TReleaseDirective): TReleaseRuleMap => {
  switch (release) {
    case 'inherit':
      return {
        major: 'major',
        minor: 'minor',
        patch: 'patch'
      }
    case 'none':
    case 'off':
    case false:
    case null: //eslint-disable-line
    case undefined:
      return {}

    case 'major':
    case 'minor':
    case 'patch':
      return (['patch', 'minor', 'major'] as TReleaseType[]).reduce<TReleaseRuleMap>((m, k) => {
        m[k] = release as TReleaseType
        return m
      }, {})

    default:
      return release
  }
}


export const resolveBumperRules = (bumperConfig: TBumperConfig, cwd: string): TBumperRules => {
  const configs = asArray(bumperConfig)
  const rules: TBumperRules = {}

  configs.forEach(({ include, deps }) => {
    const pkgNames = resolvePackageNames(include, cwd)

    pkgNames.forEach(p => {
      rules[p] = (rules[p] || {})

      deps.forEach(({ include, type, release}) => {
        const depNames = resolvePackageNames(include, cwd)

        depNames.forEach(d => {
          rules[p][d] = (rules[p][d] || {})

          const depTypes = normalizeDepType(asArray(type))

          depTypes.forEach((t) => {

            rules[p][d][t] = normalizeReleaseType(release)
          })
        })
      })
    })
  })

  return rules
}
