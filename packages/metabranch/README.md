# @qiwi/semrel-metabranch
[Semrel](https://github.com/semantic-release/semantic-release) plugin for two-way data sync with remote branch. 

## Install
```shell script
yarn add @qiwi/semrel-metabranch -D
```

## Usage
**.release.rc**
```json
{
  "plugins": [[
    "@qiwi/semrel-multibranch",
    {
      "verify": {
        "action": "fetch",
        "branch": "metabranch",
        "from": "foo",
        "to": "bar"
      }
    }
  ]]
}
```
```json
{
  "publish": [[
    "@qiwi/semrel-multibranch",
    {
      "action": "push",
      "branch": "metabranch",
      "from": "foo/**/*.txt",
      "to": "bar",
      "message": "commit message"
    }
  ]]
}
```

| Step               | Description |
|--------------------|-------------|
| `verifyConditions` | Performs actions as declared in step options. |
| `analyzeCommits`   | As prev. |
| `verifyRelease`    | ... |
| `generateNotes`    | ... |
| `prepare`          | ... |
| `publish`          | ... |
| `addChannel`       | ... |
| `success`          | ... |
| `fail`             | ... |

### Configuration
##### Environment variables

| Variable                     | Description                                               |
|------------------------------| --------------------------------------------------------- |
| `GH_TOKEN` or `GITHUB_TOKEN` | **Required.** The token used to authenticate with GitHub. |

##### Options

| Option          | Description            | Default |
|-----------------|------------------------| --------|
| `action`        | Action to perform: `fetch`/`push` |
| `branch`        | Branch to push         | `metabranch` |
| `message`       | Commit message         | `update meta` |
| `from`          | Source glob pattern    | `.` (root) |
| `to`            | Destination directory  | `.` (root) |


## API
### TActionOptions
```typescript
export type TBaseActionOptions = {
  branch: string
  from: string | string[]
  to: string
  message: string
}

export type TActionOptionsNormalized = TBaseActionOptions & {
  repo: string
  cwd: string
  temp: string
}

export type TActionType = 'fetch' | 'push'

export type TActionOptions = Partial<TActionOptionsNormalized> & {
  repo: string
}

export type TPluginOptions = Partial<TBaseActionOptions> & {
  action: TActionType
}
```

### Defaults
```typescript
export const branch = 'metabranch'
export const from = '.'
export const to = '.'
export const message = 'update meta'

export const defaults = {
  branch,
  from,
  to,
  message,
}
```
