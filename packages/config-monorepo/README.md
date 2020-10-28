# @qiwi/semrel-config-monorepo
Shared QIWI OSS config for [multi-semantic-release](https://github.com/qiwi/multi-semantic-release)  
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
yarn add @qiwi/semrel-config-monorepo
```

## Usage
Inject this shared config in any way supported by [**msr** configuration flow](https://github.com/dhoulb/multi-semantic-release#configuration).
```json
{
  "extends": "@qiwi/semrel-config--monorepo"
}
```
