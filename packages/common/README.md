# @qiwi/semrel-common
Common semrel utils: config reader, git-client, etc.

## Install
```shell script
yarn add @qiwi/semrel-common
```

## Usage
```typescript
import { gitTags } from '@qiwi/semrel-common'

const tags = await gitTags({ cwd: '/foo/bar/baz', branch: 'master' }) 
```
