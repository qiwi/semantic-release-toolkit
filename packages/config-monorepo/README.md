# @qiwi/semrel-config-monorepo
Shared QIWI OSS config for [multi-semantic-release](https://github.com/qiwi/multi-semantic-release)  
Note, plugin packages are not included. Use [@qiwi/semrel-preset](../preset/README.md) or install by hand if necessary.

## Install
```shell script
yarn add @qiwi/semrel-config-monorepo -D
```

## Usage
Inject this shared config in any way supported by [**msr** configuration flow](https://github.com/dhoulb/multi-semantic-release#configuration).
```json
{
  "extends": "@qiwi/semrel-config--monorepo"
}
```
