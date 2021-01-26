# @qiwi/semrel-git-utils
Common git utils.

## Install
```shell script
yarn add @qiwi/semrel-git-utils
```

## Usage
```typescript
import { getTags } from '@qiwi/semrel-git-utils'

const tags = await getTags({ cwd: '/foo/bar/baz', branch: 'master' }) 
```
