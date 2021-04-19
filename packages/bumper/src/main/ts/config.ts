import { readFileSync as read } from 'fs'

import { sync as globby } from 'globby'

import {
  TPackageName,
} from './interface'

const asArray = <T>(value: T): T extends any[] ? T : T[] => (Array.isArray(value) ? value: [value]) as T extends any[] ? T : T[]

const globlikePattern = /[!*]/gi

export const readPackagesNamesFromGlobs = (globs: string[], cwd: string): string[] =>
  globby(globs.map(p => p.replace(/\/package\.json$/, '') + '/package.json'), { cwd, absolute: true, onlyFiles: true })
    .map(file => JSON.parse(read(file, { encoding: 'utf8' })).name)

export const resolvePackageNames = (targets: TPackageName | TPackageName[], cwd: string): TPackageName[] => {
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
