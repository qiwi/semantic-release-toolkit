# @qiwi/semrel
[![Build Status](https://travis-ci.com/qiwi/semantic-release-toolkit.svg?branch=master)](https://travis-ci.com/qiwi/semantic-release-toolkit)
[![Maintainability](https://api.codeclimate.com/v1/badges/202e9bc2e0d5ed528ed0/maintainability)](https://codeclimate.com/github/qiwi/semantic-release-toolkit/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/202e9bc2e0d5ed528ed0/test_coverage)](https://codeclimate.com/github/qiwi/semantic-release-toolkit/test_coverage)

[Semantic-release](https://github.com/semantic-release/semantic-release) tools, plugins and configs for QIWI OSS projects

## Contents
|Package | Description
|---|---|
|[@qiwi/semrel-toolkit](./packages/toolkit/README.md)| All-in-one utility to run [semantic-release](https://github.com/semantic-release/semantic-release) and [multi-semantic-release](https://github.com/qiwi/multi-semantic-release) tasks
|[@qiwi/semrel-config](./packages/config/README.md)| Basic config to deploy a single github-hosted npm-package
|[@qiwi/semrel-config-monorepo](./packages/config/README.md)| Config to release github-hosted monorepos
|[@qiwi/semrel-preset](./packages/preset/README.md)| Semrel plugin preset
|[@qiwi/semrel-plugin-creator](./packages/plugin-creator/README.md)| Semrel plugin factory
|[@qiwi/semrel-infra](./packages/infra/README.md)| Infra package: common assets, deps, etc
|[@qiwi/semrel-testing-suite](./packages/testing-suite/README.md) | Testing helpers to verify release flow

### Coming soon
|Package | Description
|---|---|
|@qiwi/semrel-actions | Configurable custom actions/side-effects provider
|@qiwi/semrel-metabranch | Plugin for two-way data sync with remote branch
|@qiwi/msr | **[multi-semantic-release](https://github.com/qiwi/multi-semantic-release)** reforged with TS
|@qiwi/semrel-monorepo | Represents **msr** as a regular plugin

## Usage
```shell script
npx -p @qiwi/semrel-toolkit semrel -e @qiwi/semrel-config
npx -p @qiwi/semrel-toolkit multi-semrel
```
