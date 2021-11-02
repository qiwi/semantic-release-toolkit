import { IAnyMap } from '@qiwi/substrate'
import { template as compile } from 'lodash-es'
import { Context } from 'semantic-release'

export const tpl = (template: string, context: IAnyMap, logger: Context['logger']): string => {
  try {
    return compile(template)(context)
  } catch (err) {
    logger.error('lodash.template render failure', err)

    return template
  }
}
