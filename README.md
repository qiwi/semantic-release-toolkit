# @qiwi/semrel-toolkit-monorepo
Semantic release tools, plugins and configs for QIWI OSS projects

|Package | Description
|---|---|
|[@qiwi/semrel-toolkit](./packages/toolkit/README.md)| All-in-one utility to run [semantic-release](https://github.com/semantic-release/semantic-release) and [multi-semantic-release](https://github.com/qiwi/multi-semantic-release) tasks
|[@qiwi/semrel-config](./packages/config/README.md)| Basic config to deploy a single github-hosted npm-package
|[@qiwi/semrel-config-monorepo](./packages/config/README.md)| Config to run a release for github-hosted monorepo
|[@qiwi/semrel-preset](./packages/preset/README.md)| Semrel plugin preset

## Usage
```shell script
npx -p @qiwi/semrel-toolkit semrel -e @qiwi/semrel-config
```
