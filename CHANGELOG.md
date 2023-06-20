# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 4.2.0 - 2022-06-20

### Added

- `lastSeenOn`, `tampered`, and `activated` to Device entities.

### Changed

- `serial` from "UNKNOWN" to null.

## 4.1.2 - 2022-02-22

### Fixed

- We're now checking all user->token relationships for duplication before
  creation to avoid an additional duplicate key error.

## 4.1.1 - 2022-02-21

### Fixed

- We now check tokens for existence in the jobState before adding. This avoids a
  possible duplicate key error in the instance that more than one user is
  assigned a token (a valid state as documented by Duo here:
  https://help.duo.com/s/article/3094 )

## 4.1.0 - 2022-02-18

### Changed

- Upgrade integration to latest SDK packages

### Fixed

- 429 errors are now retried.
- Pagination is now used in available API calls.
- Fix various async bugs

## 4.0.1 - 2021-10-14

### Fixed

- Fixed typo in `README.md`

## 4.0.0 - 2021-10-14

### Changed

- Upgrade to latest patterns and SDK
- Removed unnecessary packages

## 3.1.1 - 2020-10-29

### Changed

- Integration validation to throw validation errors which will show up in the
  job log

## 3.1.0 - 2020-10-29

### Changed

- Upgraded to SDK v4

## 3.0.0 - 2020-09-21

### Changed

- Upgraded to SDK v3

### Added

- `duo_phone` entities
- `duo_integration` entities
- `duo_account_has_group` relationships

### Fixed

- `duo_group_has_user` relationship was not working correctly

## 1.0.4 - 2020-05-11

### Fixed

- Upgrade `@jupiterone/integration-sdk` to turn off runtime graph object
  validation. The `AccessKey` data does not always provide for a `name`
  property.

## 1.0.3 - 2020-05-11

### Changed

- Added tests for auth digest, remove modification of time string to fix
  authorization.

## 1.0.2 - 2020-05-07

### Added

- `curl-duo-api.sh` script to test credentials.
- Non-OK API responses will be raised as errors.

## 1.0.1 - 2020-05-07

### Fixed

- Added all generated `_type` values to the single step of the integration.
