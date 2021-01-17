import { createPlugin } from '@qiwi/semrel-plugin-creator'
import { push } from './actions'

export const plugin = createPlugin({
    async handler({ step , stepConfig}) {
        console.log('step', step, stepConfig)
        // @ts-ignore
        console.log('push=', push())

        return 'patch'
    }
})
