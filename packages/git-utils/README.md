# @qiwi/git-utils
Git utils for CI/CD tools.

## Install
```shell script
yarn add @qiwi/git-utils
```

## Usage
```typescript
import { gitTags } from '@qiwi/git-utils'

const tags = await gitTags({ cwd: '/foo/bar/baz', branch: 'master' }) 
```
