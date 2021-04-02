import { cleanPath, gitCreateFakeRepo } from '@qiwi/semrel-testing-suite'
import { resolve } from 'path'
import resolveFrom from 'resolve-from'
import semanticRelease from 'semantic-release'

const fixtures = resolve(__dirname, '../fixtures')

describe('plugin', () => {
  const pluginName = 'some-plugin'
  const { cwd } = gitCreateFakeRepo({
    sync: true,
    commits: [
      {
        message: 'feat: initial commit',
        from: `${fixtures}/basicPackage/`,
      },
    ],
  })
  const perform = jest.fn()

  beforeAll(() => {
    const resolveFromSilent = require('resolve-from').silent

    jest.mock(require.resolve('../../main/ts/actions'), () => ({ perform }))
    jest.mock(pluginName, () => require('../../main/ts/plugin').plugin, {
      virtual: true,
    })
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
        plugins: [
          [
            pluginName,
            {
              verifyConditions: {
                action: 'fetch',
                branch: 'metabranch',
                from: 'foo',
                to: 'bar',
                message: 'commit message',
              },
            },
          ],
        ],
      },
      {
        cwd: cleanPath(cwd),
        env,
      },
    )

    expect(perform).toHaveBeenCalledWith('fetch', {
      branch: 'metabranch',
      from: 'foo',
      to: 'bar',
      cwd: expect.any(String),
      repo: expect.any(String),
      message: 'commit message',
      debug: expect.any(Function),
      user: {
        name: 'semantic-release-bot',
        email: 'semantic-release-bot@martynus.net',
      },
    })
  }, 15000)

  it('handles `dry-run` option', async () => {
    await semanticRelease(
      {
        branches: ['master'],
        dryRun: true,
        plugins: [
          [
            pluginName,
            {
              verifyConditions: {
                action: 'push',
              },
            },
          ],
        ],
      },
      {
        cwd: cleanPath(cwd),
        env,
      },
    )
  }, 5000)

  expect(perform).not.toHaveBeenCalled()
})
