# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

*Add here new changes respecting [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) instructions.*

### Changed
- Change to use Github actions.
- Update dev dependencies (`eslint` and `jest`).
- Only branch master can publish new tags.

### Removed
- Browser support (webpack, babel, etc...).

## [v0.4.1] - 2018-10-03

### Changed
- Improve README documentation.

## [v0.4.0] - 2018-07-12

### Added
- Changelog.
- Demo version of deepicker

### Security
- Updated package-lock removing `hoek` dependency vulnerability.

## [v0.3.8] - 2018-02-19

### Added
- `.npmignore` to publish `dist` dir with minified versions.

## [v0.3.7] - 2018-02-16

### Added
- Browser version. (thanks for amazing contribution of @guicheffer!)
- Add yarn. (again, thanks @guicheffer)
- Add a precommit hook to run lint and tests. (and again, thanks @guicheffer)
- Add an issue template. (and again, thanks @guicheffer)
- Add a pull request template. (and again, thanks @guicheffer)
- Add a how to contribute file. (and again, thanks @guicheffer)

## [v0.3.6] - 2018-02-09

### Changed
- Fix `pickStatic` method to handle `null` or `undefined`.

## [v0.3.5] - 2018-02-08

### Changed
- Pickers (static and normal) now use common `include` method.
- Include method not receive anymore include/exclude trees.
- Fix `include` method when `*` has a subtree.

## [v0.3.4] - 2018-02-07

### Changed
- `include` method now receives include/exclude trees.
- Fix `include` method when include keys is filled.

## [v0.3.3] - 2018-02-07

### Added
- Github pages files

### Changed
- Fix `include` method when `*` has subtree.

## [v0.3.2] - 2018-02-07

### Changed
- Fix `toContext` method when handle `*` wildcard.

## [v0.3.1] - 2018-02-07

### Changed
- Fix linter issues.

## [v0.3.0] - 2018-02-07

### Added
- `toContext` function to move picker to a new context.

### Changed
- Fix `include` when handling `*` wild card.

## [v0.2.1] - 2018-02-06

### Changed
- Change `pickStatic` to handle arrays.
- Update `npm install` in circle CI.

## [v0.2.0] - 2018-02-06

### Added
- `pickStatic` function to handle simple js objects.

## [v0.1.2] - 2018-02-06

### Added
- Handle `*` wildcard in simple parser for include/exclude strings.
- Function to merge trees in include/exclude strings (so, removing deepmerge lib).

### Changed
- Change xpath parser of include/exclude to use new merge function.
- Handle better `*` when merging with other trees (include/exclude parser).

### Removed
- Lib deepmerge dependecy

## [v0.1.1] - 2018-02-05

### Changed
- Fix linter issues

## [v0.1.0] - 2018-02-05

### Added
- Handle `*` wildcard in xpath parser of include/exclude.
- Tests for simple parser function with `*` wildcard.
- Tests for exclude with arrays structure.

### Changed
- Improve README.

## [v0.0.3] - 2018-02-05

### Changed
- Fix promises array resolution.

## [v0.0.2] - 2018-02-05

### Added
- First valid lib version.
- Npm deployment on circle ci.
- Method `include` to be used to test if some key must be included.
- Linter
- Readme
- Parser `simpleParser` to parse simple include/excludes strings.
- CircleCi
- Parser `xpathParser` to parse "xPath like" strings for include/exclude.
- Add Editor config file.

### Changed
- Change to pass picker instance to nested function.
