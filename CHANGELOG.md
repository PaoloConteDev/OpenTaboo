# Changelog

Entries describe source versions. See GitHub Releases for published APKs.

## Unreleased

No changes yet.

## 1.1.0 — 2026-10-23

### Changed

- Separate included and custom decks in the deck browser, with the create button below the custom decks.

### Added

- Create multiple custom decks with a name and a choice of colours.
- Associate each custom deck with the language selected at creation; show and select it only in that language.
- Add, edit, and remove cards with one target word and five distinct forbidden words.
- Rename, recolour, and delete custom decks, with local persistence.
- Mix multiple custom decks with each other and with the six included decks, or play using custom decks alone.
- Keep a snapshot of custom cards in saved matches so deck edits and deletions do not alter an existing match. Custom cards retain their original wording when the interface language changes.
- Translate the deck editor into all five supported interface languages.

### Validation

- 29 automated tests passed, including five tests for custom decks.
- TypeScript, built-in card integrity, and web and Android exports passed.
- The version 1.1.0 APK (Android code 2) was built with EAS on 23 October 2026. Its manifest and signing certificate were verified; the certificate matches the previous APK. It has not been published as a new GitHub release; see [validation notes](docs/VALIDATION.md) for the build and checksum.
- Browser checks covered deck creation, multiple deck selection, language filtering, persistence after reload, gameplay, turn review, card editing, and saved-match isolation from subsequent edits.
- The editor layout was checked in a 390-pixel phone preview. Native Android hardware testing remains outstanding.
- Formatting passed for changed files. The full repository formatting check still reports existing issues in untouched files.

See [the release guide](docs/RELEASING.md) to build an APK and publish a version containing these changes.
