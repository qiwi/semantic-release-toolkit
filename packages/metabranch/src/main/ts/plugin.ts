import { createPlugin } from '@qiwi/semrel-plugin-creator'

import { perform } from './actions'
import { TPluginOptions } from './interface'

export const plugin = createPlugin({
  debug: 'semantic-release:metabranch',
  async handler({ step, stepConfig, pluginConfig, context, debug }) {
    const stepOptions = stepConfig || pluginConfig[step]

    debug(
      'handler exec:',
      'step=',
      step,
      'stepConfig=',
      JSON.stringify(stepOptions),
    )

    if (!stepOptions) {
      return
    }

    const user = {
      name: context.env.GIT_AUTHOR_NAME || context.env.GIT_COMMITTER_NAME,
      email: context.env.GIT_AUTHOR_EMAIL || context.env.GIT_COMMITTER_EMAIL,
    }
    const { branch, from, to, message, action } = stepOptions as TPluginOptions
    const actionOptions = {
      branch,
      from,
      to,
      message,
      user,
      cwd: context.cwd,
      repo: context.options?.repositoryUrl + '',
      debug,
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
