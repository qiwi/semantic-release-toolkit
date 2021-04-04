# @qiwi/semrel-metabranch
[Semrel](https://github.com/semantic-release/semantic-release) plugin for two-way data sync with any remote branch on any release step. 


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

## Install
```shell script
yarn add @qiwi/semrel-metabranch -D
```

## Usage
As a part of plugin declaration:
```json
// .release.rc
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
Action declared in release step:
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

### GitHub Pages docs pushing example
```js
module.exports = {
  debug: true,
  branch: 'master',
  plugins: [
    [
      '@qiwi/semrel-metabranch',
      {
        publish: {
          action: 'push',
          branch: 'gh-pages',
          from: './docs',
          to: '.',
          message: 'update docs ${nextRelease.gitTag}'
        }
      }
    ],
    ...
  ]
}
```

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
| `message`       | Commit message powered by lodash.template: `docs <%= nextRelease.gitTag %>` | `update meta` |
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

# License
MIT
