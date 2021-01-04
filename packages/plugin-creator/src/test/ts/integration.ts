import semanticRelease from 'semantic-release'
import resolveFrom, { silent as resolveFromSilent } from 'resolve-from'
import {createPlugin} from '../../main/ts'

describe('integration', () => {
  const handler: any = jest.fn()
  const pluginName = 'some-plugin'
  const plugin = createPlugin({handler, name: pluginName})

  beforeAll(() => {
    jest.mock(pluginName, () => plugin, {virtual: true})
    jest.spyOn(resolveFrom, 'silent').mockImplementation((fromDir: string, moduleId: string) => {
      if (moduleId === pluginName) {
        return pluginName
      }

      return resolveFromSilent(fromDir, moduleId) as string
    })
  })

  afterAll(() => {
    jest.restoreAllMocks()
    jest.resetModules()
  })

  it('plugin is compatible with semrel', async () => {
    await semanticRelease({
      dryRun: true,
      plugins: [pluginName]
    })
  }, 30000)
})
