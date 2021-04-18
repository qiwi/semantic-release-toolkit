# @qiwi/semrel-bumper
[Semrel](https://github.com/semantic-release/semantic-release) assets to resolve cross-packages version bumping.

## Concept
`@qiwi/semrel-bumper` lets to declare and resolve how each monorepo pkg release should be interpreted for its dependants.

## Install
```shell script
yarn add @qiwi/semrel-bumper -D
```

## Usage
**.msr.json**

```json
{
  "bumper": [{
    "include": "packages/*",
    "deps": [{
      "type": "all",
      "include": "*",
      "releaseRule": {
        "all": "patch"
      }
    }]
  }]
}
```

# License
MIT
