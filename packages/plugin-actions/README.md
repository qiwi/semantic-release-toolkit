# @qiwi/semrel-actions
[Semrel](https://github.com/semantic-release/semantic-release) plugin for data syncing with remote workspaces

## Motivation
The main purpose of this plugin is to provide _non-blocking_ release flow (no commits, no conflicts),
but keep the benefits of stateful operations like changelog appending, docs publishing and so on.

## Usage area
* Shared build state
* Cross-release semaphore
* Build meta publishing: coverage, buildstamp

## Status
🚧 WIP 🚧

## Install
```shell script
yarn add @qiwi/semrel-actions -D
```

## Config examples
```json
{
  "plugins": [
    ["@qiwi/semrel-actions", {
      "providers": [
        {
          "provider": "metabranch",
          "options": {
            "branch": "metabranch",
            "url": "repoUrl"
          }
        }
      ]
    }]
  ],
  "prepare": [
    ["@qiwi/semrel-actions", {
      "actions": [{
        "provider": "metabranch",
        "options": {
          "from": "<branch>-<packageName>-changelog.md",
          "to": "changelog.md"
        }
      }]
    }]
  ],
  "publish": [
    ["@qiwi/semrel-actions", {
      "actions": [{
        "provider": "metabranch",
        "options": {
          "from": ["docs/*", "coverage/*", "buildstamp.json"],
          "to": "<git>/<nextVersion>"
        }
      }, {
        "provider": "metabranch",
        "options": {
          "from": "changelog.md",
          "to": "<branch>-<packageName>-changelog.md"
        }
      }]
    }]
  ]
}
```
