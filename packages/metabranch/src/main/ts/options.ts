import { temporaryDirectory } from 'tempy'

import { TActionOptions, TActionOptionsNormalized } from './interface'

export const branch = 'metabranch'
export const from = '.'
export const to = '.'
export const message = 'update meta'

export const defaults = {
  branch,
  from,
  to,
  message,
}

export const normalizeOptions = ({
  branch = defaults.branch,
  from = defaults.from,
  to = defaults.to,
  message = defaults.message,
  cwd = process.cwd(),
  temp = temporaryDirectory(),
  repo,
  debug,
  user,
}: TActionOptions): TActionOptionsNormalized => ({
  branch,
  from,
  to,
  message,
  cwd,
  temp,
  repo,
  debug,
  user,
})
