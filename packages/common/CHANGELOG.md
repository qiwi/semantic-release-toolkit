## @qiwi/semrel-common [3.2.3](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@3.2.2...@qiwi/semrel-common@3.2.3) (2022-03-04)





### Dependencies

* **@qiwi/semrel-infra:** upgraded to 3.0.1

## @qiwi/semrel-common [3.2.2](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@3.2.1...@qiwi/semrel-common@3.2.2) (2022-02-22)


### Bug Fixes

* pin npm ([de604dd](https://github.com/qiwi/semantic-release-toolkit/commit/de604dddb9c3d968fc7a878b0f473a3d06e9f750))

## @qiwi/semrel-common [3.2.1](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@3.2.0...@qiwi/semrel-common@3.2.1) (2021-12-29)


### Bug Fixes

* fix globs on windows via @qiwi/multi-semantic-release update ([c4d9278](https://github.com/qiwi/semantic-release-toolkit/commit/c4d927884208c1190ed746c823a97c1257da8a7b))

# @qiwi/semrel-common [3.2.0](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@3.1.0...@qiwi/semrel-common@3.2.0) (2021-12-23)


### Features

* **common:** provide depth option for gitFetch ([07a8b6c](https://github.com/qiwi/semantic-release-toolkit/commit/07a8b6c687a28233e39dcf46a68b5a5360abb0e1))

# @qiwi/semrel-common [3.1.0](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@3.0.0...@qiwi/semrel-common@3.1.0) (2021-12-22)


### Features

* **common:** git exec returns stderr if stdout is empty (gerrit case) ([7cb4478](https://github.com/qiwi/semantic-release-toolkit/commit/7cb447853bc847a3ca480edc7c7f42d73c8d3940))
* **common:** provide custom refspec for gitPush ([f9cb0f2](https://github.com/qiwi/semantic-release-toolkit/commit/f9cb0f2683c91696fc183551640a859ca5003956))

# @qiwi/semrel-common [3.0.0](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@2.1.0...@qiwi/semrel-common@3.0.0) (2021-11-17)


### Bug Fixes

* up deps to fix internal esm-cjs interop ([830ac9d](https://github.com/qiwi/semantic-release-toolkit/commit/830ac9dc86c5bad940628c07d2155524a42be71f))


### Features

* add esnext bundle ([d18b30c](https://github.com/qiwi/semantic-release-toolkit/commit/d18b30cff360536b76e403a6a658c2bf75ca5e43))
* **common:** move to esm ([184adcc](https://github.com/qiwi/semantic-release-toolkit/commit/184adcc419a7a2323d08e32cc13f1e95612d12aa))


### BREAKING CHANGES

* **common:** dropped legacy `require` API





### Dependencies

* **@qiwi/semrel-infra:** upgraded to 3.0.0

# @qiwi/semrel-common [2.1.0](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@2.0.0...@qiwi/semrel-common@2.1.0) (2021-10-28)


### Bug Fixes

* fix build:ts script ([28e22bc](https://github.com/qiwi/semantic-release-toolkit/commit/28e22bc79449f51cbb5eedd09f5d91614b0caaeb))


### Features

* **preset:** update semrel-gh-pages plugin ([b78f0c6](https://github.com/qiwi/semantic-release-toolkit/commit/b78f0c6365563dbb5f95b342bd045be576dc51b7))





### Dependencies

* **@qiwi/semrel-infra:** upgraded to 2.1.0

# @qiwi/semrel-common [2.0.0](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@1.4.6...@qiwi/semrel-common@2.0.0) (2021-09-27)


### Performance Improvements

* update deps ([17a7685](https://github.com/qiwi/semantic-release-toolkit/commit/17a76851ee9e64af7c63d89fbad188df8b70bcd2))


### BREAKING CHANGES

* require semrel >=18, require Node.js >= 14.17





### Dependencies

* **@qiwi/semrel-infra:** upgraded to 2.0.0

## @qiwi/semrel-common [1.4.6](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@1.4.5...@qiwi/semrel-common@1.4.6) (2021-08-25)





### Dependencies

* **@qiwi/semrel-infra:** upgraded to 1.1.5

## @qiwi/semrel-common [1.4.5](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@1.4.4...@qiwi/semrel-common@1.4.5) (2021-07-07)


### Bug Fixes

* update deps, fix vuls ([d73d0fe](https://github.com/qiwi/semantic-release-toolkit/commit/d73d0fe28af8cdfbd3d7dd19ead37ceeb39ceaa3))





### Dependencies

* **@qiwi/semrel-infra:** upgraded to 1.1.4

## @qiwi/semrel-common [1.4.4](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@1.4.3...@qiwi/semrel-common@1.4.4) (2021-06-18)


### Bug Fixes

* **deps:** downgrade file-url to v3 ([5d1b12b](https://github.com/qiwi/semantic-release-toolkit/commit/5d1b12bd63e708a8667068535f57170702a20348)), closes [#71](https://github.com/qiwi/semantic-release-toolkit/issues/71)
* **deps:** update dependency file-url to v4 ([f4d744f](https://github.com/qiwi/semantic-release-toolkit/commit/f4d744f017bc6a12e110fc66b5033850db3c0552))

## @qiwi/semrel-common [1.4.3](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@1.4.2...@qiwi/semrel-common@1.4.3) (2021-06-17)


### Bug Fixes

* **package:** update deps, fix vuls ([c94e353](https://github.com/qiwi/semantic-release-toolkit/commit/c94e353bfa1ca228325f97aaba3ffa5e433d3139))





### Dependencies

* **@qiwi/semrel-infra:** upgraded to 1.1.3

## @qiwi/semrel-common [1.4.2](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@1.4.1...@qiwi/semrel-common@1.4.2) (2021-05-17)


### Bug Fixes

* **deps:** downgrade file-url ([7f4ab76](https://github.com/qiwi/semantic-release-toolkit/commit/7f4ab761ed48e69651904a777f0e3c54e696fe2a))
* **deps:** up deps, fix vulns ([c718296](https://github.com/qiwi/semantic-release-toolkit/commit/c718296c9ba2b582e046ef561813771481d10897))





### Dependencies

* **@qiwi/semrel-infra:** upgraded to 1.1.2

## @qiwi/semrel-common [1.4.1](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@1.4.0...@qiwi/semrel-common@1.4.1) (2021-04-04)





### Dependencies

* **@qiwi/semrel-infra:** upgraded to 1.1.1

# @qiwi/semrel-common [1.4.0](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@1.3.0...@qiwi/semrel-common@1.4.0) (2021-04-02)


### Features

* **metabranch:** add template for commit message, other refactorings ([382e0f7](https://github.com/qiwi/semantic-release-toolkit/commit/382e0f7a707ac60410a2929ca85348a146b4a522)), closes [#35](https://github.com/qiwi/semantic-release-toolkit/issues/35)

# @qiwi/semrel-common [1.3.0](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@1.2.0...@qiwi/semrel-common@1.3.0) (2021-04-02)


### Features

* **common:** add gitSetUser helper ([6161d90](https://github.com/qiwi/semantic-release-toolkit/commit/6161d9091a69d27496a9a07a23822d1612b51a11))
* **metabranch:** inherit git user env for commits ([f37852e](https://github.com/qiwi/semantic-release-toolkit/commit/f37852e93cbd2edbcef8a74a7caa24c81fbc013b))

# @qiwi/semrel-common [1.2.0](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@1.1.0...@qiwi/semrel-common@1.2.0) (2021-04-02)


### Features

* **plugin-creator:** provide dual export for pkg ([c2ba201](https://github.com/qiwi/semantic-release-toolkit/commit/c2ba2010026d06f400c70ed57f4b89ebdc118a1b))





### Dependencies

* **@qiwi/semrel-infra:** upgraded to 1.1.0

# @qiwi/semrel-common [1.1.0](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@1.0.2...@qiwi/semrel-common@1.1.0) (2021-03-22)


### Features

* **testing-suite:** add enhanced fakeRepo builder ([284d050](https://github.com/qiwi/semantic-release-toolkit/commit/284d050076fc776b7199b967295b219fe2d3e672))

## @qiwi/semrel-common [1.0.2](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@1.0.1...@qiwi/semrel-common@1.0.2) (2021-03-12)


### Performance Improvements

* **deps:** update semrel to 17.4.2 ([e25c584](https://github.com/qiwi/semantic-release-toolkit/commit/e25c58410d0c67d80e58d13b76c2f005282f5708))

## @qiwi/semrel-common [1.0.1](https://github.com/qiwi/semantic-release-toolkit/compare/@qiwi/semrel-common@1.0.0...@qiwi/semrel-common@1.0.1) (2021-03-11)


### Bug Fixes

* **pkg:** up deps, fix vuls ([3bd0514](https://github.com/qiwi/semantic-release-toolkit/commit/3bd051436e6466000443d44f5aa819f67080f534))


### Performance Improvements

* cross-package refactorings ([3defc27](https://github.com/qiwi/semantic-release-toolkit/commit/3defc2728b3fb5cb5d0cd010a3dd0ba86079dd74))





### Dependencies

* **@qiwi/semrel-infra:** upgraded to 1.0.5

# @qiwi/semrel-common 1.0.0 (2021-01-30)


### Features

* **common:** provide both sync and async flows for git-utils ([4b5a4c9](https://github.com/qiwi/semantic-release-toolkit/commit/4b5a4c9cb24618a0ec57c966e08e6bb083aa4cc6))
* add semrel-config and semrel-config-monorepo ([ad7ba33](https://github.com/qiwi/semantic-release-toolkit/commit/ad7ba33cf6f6705c1f1f1919c197d5ad7345de4b))
