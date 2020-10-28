# @qiwi/semrel-config
Shared QIWI OSS config for [semantic-release](https://github.com/semantic-release/semantic-release)  
What's inside:
* [@qiwi/semantic-release-gh-pages-plugin](https://github.com/qiwi/semantic-release-gh-pages-plugin)
* [@semantic-release/commit-analyzer](https://github.com/semantic-release/commit-analyzer)
* [@semantic-release/release-notes-generator](https://github.com/semantic-release/release-notes-generator)
* [@semantic-release/changelog](https://github.com/semantic-release/changelog)
* [@semantic-release/npm](https://github.com/semantic-release/npm)
* [@semantic-release/github](https://github.com/semantic-release/github)
* [@semantic-release/git](https://github.com/semantic-release/git)

## Install
```shell script
yarn add @qiwi/semrel-config
```

## Usage
Inject this shared config in any way supported by [semrel configuration flow](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration). For example, **.releaserc**:
```json
{
  "extends": "@qiwi/semrel-config"
}
```
