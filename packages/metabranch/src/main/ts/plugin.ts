import { createPlugin } from '@qiwi/semrel-plugin-creator'

import { perform } from './actions'
import { TPluginOptions } from './interface'

export const plugin = createPlugin({
  async handler({ step, stepConfig, pluginConfig, context }) {
    const stepOptions = stepConfig || pluginConfig[step]

    if (!stepOptions) {
      return
    }

    const { branch, from, to, message, action } = stepOptions as TPluginOptions
    const actionOptions = {
      branch,
      from,
      to,
      message,
      cwd: context.cwd,
      repo: context.options?.repositoryUrl + '',
    }

    if (context.options?.dryRun && action === 'push') {
      context.logger.log(
        '[metabranch] `push` action is disabled in dry-run mode',
      )

      return
    }

    await perform(action, actionOptions)
  },
})
