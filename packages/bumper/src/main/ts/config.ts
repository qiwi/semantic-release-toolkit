import { sync as globby } from 'globby'

import {
  TBumperConfig, TBumperDirectives, TBumperRules, TDependencyType, TDependencyTypeNormalized,
  TPackageName, TReleaseDirective, TReleaseRuleMap, TReleaseType,
  IPackageDeps, IPackage
} from './interface'

import {
  asArray,
  readJson
} from './utils'

export const readPackagesFromGlobs = (globs: string[], cwd: string): IPackage[] =>
  globby(globs.map(p => p.replace(/\/package\.json$/, '') + '/package.json'), { cwd, absolute: true, onlyFiles: true })
    .map(readJson)

export const readPackagesNamesFromGlobs = (globs: string[], cwd: string): string[] =>
  readPackagesFromGlobs(globs, cwd).map(({ name }) => name)

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

// const releaseTypeSeverityOrder: TReleaseType[] = ['patch', 'minor', 'major']
// const depTypeMapping = {
//   dependencies: 'prod',
//   devDependencies: 'dev',
//   peerDependencies: 'peer',
//   optionalDependencies: 'optional'
// }


const depTypeMapping: Record<TDependencyTypeNormalized, keyof IPackage> = {
  prod: 'dependencies',
  dev: 'devDependencies',
  peer: 'peerDependencies',
  optional: 'optionalDependencies'
}

export const resolveBumperDirective = (bumperRules: TBumperRules, pkg: IPackage, name: TPackageName, depType: TDependencyTypeNormalized, releaseType: TReleaseType): TReleaseType | undefined=>
  (pkg[depTypeMapping[depType]] as IPackageDeps)?.[name] ? bumperRules?.[pkg.name]?.[name]?.[depType]?.[releaseType] : undefined

export const resolveBumperDirectives = (bumperConfig: TBumperConfig, workspaces: string | string[], cwd: string): TBumperDirectives => {
  const bumperRules = resolveBumperRules(bumperConfig, cwd)
  const packages = readPackagesFromGlobs(asArray(workspaces), cwd)
  const directives: TBumperDirectives = {}
  const extract = (pkg: IPackage, _name: TPackageName, depType: TDependencyTypeNormalized, releaseType: TReleaseType): TReleaseType | undefined =>
    (pkg[depTypeMapping[depType]] as IPackageDeps)?.[_name] ? bumperRules?.[pkg.name]?.[_name]?.[depType]?.[releaseType] : undefined


  packages.forEach((pkg) => {

    directives[pkg.name] = {}


    packages.forEach(({name: _name}) => {

      const patchRules = [
        extract(pkg, _name, 'prod', 'patch')
      ]

      console.log(patchRules)

    })

  })

  // console.log('!!!directives = ', directives)



  return directives
}

export const getBumperDirective = (bumperDirectives: TBumperDirectives): TReleaseType | undefined => {
  if (bumperDirectives) {
    return 'patch'
  }
}
