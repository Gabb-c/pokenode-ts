# Changelog

## [2.0.0](https://github.com/Gabb-c/pokenode-ts/compare/v1.19.0...v2.0.0) (2026-08-15)


### ⚠ BREAKING CHANGES

* ItemClient#listItemFilingEffects is renamed to listItemFlingEffects. The old name was a typo — the endpoint is item-fling-effect, after the move Fling — and no alias is kept, because 2.0 already asks callers to revisit their imports. Behavior is unchanged.
* axios and axios-cache-interceptor are no longer peer dependencies. cacheOptions is replaced by cache?: CacheStore | false, and logs?: boolean by logger?: Logger. ClientArgs is renamed ClientOptions. Failed requests reject with PokenodeError instead of AxiosError; match it with isPokenodeError rather than instanceof, which is false across a duplicated ESM/CJS copy of the class. MainClient no longer extends BaseClient. getResourceByURL throws a TypeError on a URL that names no endpoint under the base URL, where it previously issued a malformed request. ENDPOINTS.POKEMON_LOCATION_AREA is removed; it held a template, not an endpoint.

### Features

* add base getListURL method ([1b387c6](https://github.com/Gabb-c/pokenode-ts/commit/1b387c639229282934ca561c8661c911f20a2757))
* add currency client ([ed1a18f](https://github.com/Gabb-c/pokenode-ts/commit/ed1a18f968282b78abf6517c8878a2eea1409f8f))
* Add Showdown animated sprites ([02184a1](https://github.com/Gabb-c/pokenode-ts/commit/02184a11bb03608f7f1bd348137902cad19b6bf3))
* **clients:** add getResourceByURL for a custom base URL [#903](https://github.com/Gabb-c/pokenode-ts/issues/903) ([a76e5a0](https://github.com/Gabb-c/pokenode-ts/commit/a76e5a0481d00449bcbc48afd3e17a62fd4bf2a0))
* **clients:** refactor clients ([b3475f5](https://github.com/Gabb-c/pokenode-ts/commit/b3475f5781779d04f5d5a4920efd28ce4006a152))
* **models:** change from interface to type ([e2aa37c](https://github.com/Gabb-c/pokenode-ts/commit/e2aa37cd7f0755d5cb6692683cfa82cbdf63be44))
* **models:** update pokemon typings ([b74341a](https://github.com/Gabb-c/pokenode-ts/commit/b74341aede5204b2eb62304205765db54b36fc15))
* new build and release system ([1ed23bf](https://github.com/Gabb-c/pokenode-ts/commit/1ed23bfffdba17e91167a55c05c3025dfcdc82c6))
* refactor berry client ([eb2e30d](https://github.com/Gabb-c/pokenode-ts/commit/eb2e30d0ae2d2ae9c24c09e8b7813f6933826c29))
* replace axios with native fetch ([88ca8d5](https://github.com/Gabb-c/pokenode-ts/commit/88ca8d599ba6d66d44852c17fa776619a693dfbf))
* replace axios with native fetch ([a2f3c24](https://github.com/Gabb-c/pokenode-ts/commit/a2f3c24a33a245255ee143c66209000b0dff9db0))
* update evolution and pokemon typings ([f3a6086](https://github.com/Gabb-c/pokenode-ts/commit/f3a6086419a87066dcb213595ed207a6b088fe2d))


### Bug Fixes

* **base:** change base url enum to as const ([25e1be1](https://github.com/Gabb-c/pokenode-ts/commit/25e1be1ee88f7fc87f0fa87b1f5e6f52ff537f5f))
* **base:** fix get resource ([fa6576a](https://github.com/Gabb-c/pokenode-ts/commit/fa6576a37f7d41e1a483fcb0b26a77dbc07bb540))
* **build:** tsdown config ([be56498](https://github.com/Gabb-c/pokenode-ts/commit/be564982314afe4103a09bdf6dc35ddbeba9d3c1))
* **ci:** remove tsc lint from ci ([cea9117](https://github.com/Gabb-c/pokenode-ts/commit/cea9117c64d0f21487f41064f302dfa7acbecabf))
* **clients:** remove unused axios typings ([55d3aa8](https://github.com/Gabb-c/pokenode-ts/commit/55d3aa8aaacffaa59190cede57095baca6d89304))
* **clients:** revert usage of URLSearchParams [#839](https://github.com/Gabb-c/pokenode-ts/issues/839) ([c92e365](https://github.com/Gabb-c/pokenode-ts/commit/c92e3655cae153d4569c2f0ccdb4351aa8166cdf))
* **constants:** remove enums for readonly consts ([483252a](https://github.com/Gabb-c/pokenode-ts/commit/483252a39dd277c4a6d7cd1389551e9a18d4bf86))
* **lint:** replace rome for biome ([a6c2cff](https://github.com/Gabb-c/pokenode-ts/commit/a6c2cff5523c38f847048dceeeb71a4bb97107c6))
* **models:** add version to FlavorText interface ([793f266](https://github.com/Gabb-c/pokenode-ts/commit/793f2663539a7f1a48b5022ff575011d108c0757))
* pin nodejs version ([b410640](https://github.com/Gabb-c/pokenode-ts/commit/b410640e4fca87c108e9a2b83628b855f475377f))
* typo ([0c13ada](https://github.com/Gabb-c/pokenode-ts/commit/0c13ada2924bfc6d36689e673e61fd1d4d45649e))
* typo ([9bc9076](https://github.com/Gabb-c/pokenode-ts/commit/9bc90762a9f32236a51ba92639bc9521ca0a5753))


### Documentation

* overhaul documentation and .github ([6621101](https://github.com/Gabb-c/pokenode-ts/commit/66211016dd7df2ad7d56fe538022d55b5ae2f2f3))
