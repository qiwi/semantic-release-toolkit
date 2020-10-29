# @qiwi/semrel-config
Shared QIWI OSS config for [semantic-release](https://github.com/semantic-release/semantic-release)  
Note, plugin packages are not included. Use [@qiwi/semrel-preset](../preset/README.md) or install by hand if necessary.

## Install
```shell script
yarn add @qiwi/semrel-config -D
```

## Usage
Inject this shared config in any way supported by [semrel configuration flow](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration). For example, **.releaserc**:
```json
{
  "extends": "@qiwi/semrel-config"
}
```
