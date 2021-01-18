import { createPlugin } from '@qiwi/semrel-plugin-creator'

import { perform } from './actions'
import { TPluginOptions } from './interface'

export const plugin = createPlugin({
  async handler({ step, stepConfig, pluginConfig, context }) {
    const options = stepConfig || pluginConfig[step]

    if (!options) {
      return
    }

    const { branch, from, to, message, action } = options as TPluginOptions
    const actionOptions = {
      branch,
      from,
      to,
      message,
      cwd: context.cwd,
      repo: context.options?.repositoryUrl + '',
    }

    await perform(action, actionOptions)
  },
})
