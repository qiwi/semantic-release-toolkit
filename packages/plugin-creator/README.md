# @qiwi/semrel-plugin-creator
Semrel plugin creator

## Install
```shell script
yarn add @qiwi/semrel-plugin-creator
```

## Usage
```typescript
import {createPlugin} from '@qiwi/semrel-plugin-creator'

const handler = async ({step, pluginConfig, context, name}) => {
  if (step === 'prepate') {
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
