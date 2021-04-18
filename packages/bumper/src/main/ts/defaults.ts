import { TBumperConfig } from './interface'

export const DEFAULT_BUMPER_CONFIG: TBumperConfig = {
  include: '*',
  deps: [{
    type: 'all',
    include: '*',
    releaseRule: {
      major: 'patch',
      minor: 'patch',
      patch: 'patch'
    }
  }]
}
