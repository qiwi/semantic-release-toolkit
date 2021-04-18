import { sync as globby } from 'globby'
import {
  TBumperDirective,
  TBumperConfig,
  TBumperRules,
} from './interface'

const asArray = <T>(value: T): T extends any[] ? T : T[] => (Array.isArray(value) ? value: [value]) as T extends any[] ? T : T[]

const globlikePattern = /[!*]/gi

export const resolveBumperConfig = (config: TBumperConfig, cwd: string = process.cwd()): TBumperRules => {
  const directives: TBumperDirective[] = asArray(config)

  const rules = directives.reduce<TBumperRules>((memo, { packages }) => {

    const pkgs = globby(packages, { absolute: true, cwd })

    return memo
  }, {})

  console.log('!!!', rules)

  return rules
}
