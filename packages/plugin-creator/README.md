# @qiwi/semrel-plugin-creator
[Semrel](https://github.com/semantic-release/semantic-release) plugin creator

## Install
```shell script
yarn add @qiwi/semrel-plugin-creator
```

## Usage
```typescript
import {createPlugin} from '@qiwi/semrel-plugin-creator'

const handler = async ({step, pluginConfig, context, name}) => {
  if (step === 'prepare') {
    pluginConfig.foo = 'bar'
  }

  if (step === 'publish') {
    await doSomething()
  }
}

const plugin = createPlugin({
  handler,
  name: 'plugin-name',
  include: ['prepare', 'publish']
})
```

## API
```typescript
export type TPluginHandlerContext = {
  pluginConfig: TPluginConfig
  stepConfig: TPluginConfig
  stepConfigs: TStepConfigs
  context: TSemrelContext
  step: TReleaseStep
}

export type TPluginFactoryOptionsNormalized = {
  handler: TReleaseHandler
  name?: string
  include: TReleaseStep[]
  exclude: TReleaseStep[]
  require: TReleaseStep[]
}

export type TPluginFactoryOptions = Partial<TPluginFactoryOptionsNormalized>

export type TReleaseHandler = (context: TPluginHandlerContext) => Promise<any>

export type TPluginFactory = (
  handler: TPluginFactoryOptions | TReleaseHandler,
) => TPlugin
```
