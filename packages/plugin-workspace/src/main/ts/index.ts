import {createPlugin} from '@qiwi/semrel-plugin-creator'

export const plugin = createPlugin({
  async handler({step}) {
    console.log(step)
  },
  exclude: ['analyzeCommits', 'generateNotes']
})

export default plugin
