import { createPlugin } from '@qiwi/semrel-plugin-creator'
import { perform } from './actions'
import { TPluginOptions } from './interface'

export const plugin = createPlugin({
    async handler({ step , stepConfig, pluginConfig, context}) {
        const { branch, from, to, message, action } = (stepConfig || pluginConfig[step]) as TPluginOptions
        const options = {
            branch,
            from,
            to,
            message,
            cwd: context.cwd,
            repo: context.options?.repositoryUrl + ''
        }

        await perform(action, options)

        return 'patch'
    }
})
