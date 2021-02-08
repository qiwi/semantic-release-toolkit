# @qiwi/semrel
[![Build Status](https://travis-ci.com/qiwi/semantic-release-toolkit.svg?branch=master)](https://travis-ci.com/qiwi/semantic-release-toolkit)
[![Maintainability](https://api.codeclimate.com/v1/badges/202e9bc2e0d5ed528ed0/maintainability)](https://codeclimate.com/github/qiwi/semantic-release-toolkit/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/202e9bc2e0d5ed528ed0/test_coverage)](https://codeclimate.com/github/qiwi/semantic-release-toolkit/test_coverage)

[Semantic-release](https://github.com/semantic-release/semantic-release) tools, plugins and configs for QIWI OSS projects

## Contents
|Package | Description | Latest
|---|---|---|
|[@qiwi/semrel-toolkit](./packages/toolkit)| All-in-one utility to run [semantic-release](https://github.com/semantic-release/semantic-release) and [multi-semantic-release](https://github.com/qiwi/multi-semantic-release) tasks | [![npm](https://img.shields.io/npm/v/@qiwi/semrel-toolkit/latest.svg?label=&color=09e)](https://www.npmjs.com/package/@qiwi/semrel-toolkit)
|[@qiwi/semrel-config](./packages/config)| Basic config to deploy a single github-hosted npm-package | [![npm](https://img.shields.io/npm/v/@qiwi/semrel-config/latest.svg?label=&color=09e)](https://www.npmjs.com/package/@qiwi/semrel-config)
|[@qiwi/semrel-config-monorepo](./packages/config)| Config to release github-hosted monorepos | [![npm](https://img.shields.io/npm/v/@qiwi/semrel-config-monorepo/latest.svg?label=&color=09e)](https://www.npmjs.com/package/@qiwi/semrel-config-monorepo)
|[@qiwi/semrel-preset](./packages/preset)| Semrel plugin preset | [![npm](https://img.shields.io/npm/v/@qiwi/semrel-preset/latest.svg?label=&color=09e)](https://www.npmjs.com/package/@qiwi/semrel-preset)
|[@qiwi/semrel-plugin-creator](./packages/plugin-creator) | Semrel plugin factory | [![npm](https://img.shields.io/npm/v/@qiwi/semrel-plugin-creator/latest.svg?label=&color=09e)](https://www.npmjs.com/package/@qiwi/semrel-plugin-creator)
|[@qiwi/semrel-infra](./packages/infra) | Infra package: common assets, deps, etc | [![npm](https://img.shields.io/npm/v/@qiwi/semrel-infra/latest.svg?label=&color=09e)](https://www.npmjs.com/package/@qiwi/semrel-infra)
|[@qiwi/semrel-testing-suite](./packages/testing-suite) | Testing helpers to verify release flow<br/>**experimental** | [![npm](https://img.shields.io/npm/v/@qiwi/semrel-testing-suite/latest.svg?label=&color=fc3)](https://www.npmjs.com/package/@qiwi/semrel-testing-suite)
|[@qiwi/semrel-metabranch](./packages/metabranch) | Plugin for two-way data sync with remote branch<br/>**experimental** | [![npm](https://img.shields.io/npm/v/@qiwi/semrel-metabranch/latest.svg?label=&color=fc3)](https://www.npmjs.com/package/@qiwi/semrel-metabranch)


### Coming soon
|Package | Description
|---|---|
|@qiwi/semrel-actions | Configurable custom actions/side-effects provider
|@qiwi/msr | **[multi-semantic-release](https://github.com/qiwi/multi-semantic-release)** reforged with TS
|@qiwi/semrel-monorepo | Represents **msr** as a regular plugin

## License
[MIT](./LICENSE)
