import { resolve } from 'path'
import resolveFrom, { silent as resolveFromSilent } from 'resolve-from'
import semanticRelease from 'semantic-release'

import { createPlugin } from '../../main/ts'
import { copyDirectory } from './assets/file'
import { gitCommitAll, gitInit, gitInitOrigin, gitPush } from './assets/git'

const fixtures = resolve(__dirname, '../fixtures')

describe('integration', () => {
  const handler: any = jest.fn(({ step }) => {
    if (step === 'analyzeCommits') {
      return 'patch'
    }
  })
  const pluginName = 'some-plugin'
  const plugin = createPlugin({ handler, name: pluginName })
  const cwd = gitInit()

  copyDirectory(`${fixtures}/yarnWorkspaces/`, cwd)
  gitCommitAll(cwd, 'feat: Initial release')
  gitInitOrigin(cwd)
  gitPush(cwd)

  beforeAll(() => {
    jest.mock(pluginName, () => plugin, { virtual: true })
    jest
      .spyOn(resolveFrom, 'silent')
      .mockImplementation((fromDir: string, moduleId: string) => {
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

  afterEach(jest.clearAllMocks)

  it('plugin is compatible with semrel', async () => {
    await semanticRelease(
      {
        branches: ['master'],
        noCi: true,
        dryRun: true,
        plugins: [pluginName],
      },
      {
        cwd,
      },
    )

    expect(handler).toBeCalledTimes(4)
  }, 15000)

  it('release handler is invoked with proper context', async () => {
    const commonPluginConfig = { common: true }
    const preparePluginConfig = { prepare: true }
    const publishPluginConfig = { publish: true }
    const stepConfigs = {
      prepare: preparePluginConfig,
      publish: publishPluginConfig,
    }
    const env = { ...process.env, FOO: 'bar' }
    await semanticRelease(
      {
        branches: ['master'],
        noCi: true,
        dryRun: false,
        plugins: [[pluginName, commonPluginConfig]],
        prepare: [[pluginName, preparePluginConfig]],
        publish: [
          {
            path: pluginName,
            ...publishPluginConfig,
          },
        ],
      },
      {
        cwd,
        env,
      },
    )

    const expectedContext = {
      env,
    }
    // prettier-ignore
    const expectedArgs = [
      {step: 'verifyConditions', pluginConfig: commonPluginConfig, context: expectedContext},
      {step: 'analyzeCommits', context: expectedContext},
      {step: 'verifyRelease', context: expectedContext},
      {step: 'generateNotes'},
      {
        step: 'prepare',
        pluginConfig: preparePluginConfig,
        stepConfig: preparePluginConfig,
        stepConfigs,
        context: {
          ...expectedContext,
          nextRelease: {
            type: 'patch',
            version: '1.0.0',
            gitTag: 'v1.0.0',
            name: 'v1.0.0',
            notes: ''
          }
        }
      },
      {step: 'publish', pluginConfig: publishPluginConfig, stepConfig: publishPluginConfig, stepConfigs},
      {step: 'success'},
    ]
    expectedArgs.forEach((handlerContext, index) =>
      expect(handler.mock.calls[index][0]).toMatchObject(handlerContext),
    )

    expect(handler).toBeCalledTimes(7)
  }, 15000)
})
