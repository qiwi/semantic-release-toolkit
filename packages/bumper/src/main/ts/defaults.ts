import { TBumperConfig } from './interface'

export const DEFAULT_BUMPER_CONFIG: TBumperConfig = {
  packages: undefined,
  dependencyType: 'any',
  releaseMap: {
    major: 'patch',
    minor: 'patch',
    patch: 'patch'
  }
}
