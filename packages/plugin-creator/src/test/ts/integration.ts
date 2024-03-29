import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { jest } from '@jest/globals'
import {
  cleanPath,
  gitCreateFakeRepo,
} from '@qiwi/semrel-testing-suite'
import resolveFrom, { silent as resolveFromSilent } from 'resolve-from'
import semanticRelease from 'semantic-release'

import { createPlugin } from '../../main/ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const fixtures = resolve(__dirname, '../fixtures')

describe('integration', () => {
  const handler: any = jest.fn(({ step }) => {
    if (step === 'analyzeCommits') {
      return 'patch'
    }
  })
  const pluginName = 'some-plugin'
  const plugin = createPlugin({ handler, name: pluginName })
  const { cwd } = gitCreateFakeRepo({
    sync: true,
    commits: [
      {
        message: 'feat: initial commit',
        from: `${fixtures}/yarnWorkspaces/`,
      },
    ],
  })

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

  const env = {
    ...process.env,
    TRAVIS_PULL_REQUEST_BRANCH: 'master',
    TRAVIS_BRANCH: 'master',
    GITHUB_REF: 'master',
    GITHUB_BASE_REF: 'master',
  }

  it('plugin is compatible with semrel', async () => {
    await semanticRelease(
      {
        branches: ['master'],
        dryRun: true,
        plugins: [pluginName],
      },
      {
        cwd: cleanPath(cwd),
        env,
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

    await semanticRelease(
      {
        branches: ['master'],
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
        cwd: cleanPath(cwd),
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
