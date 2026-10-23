# Build and publish an Android APK

## Source changes and installed releases

Updating the source or running `npm run export:android` does not update an installed APK or a GitHub release. The Android export in `dist-android/` contains a Hermes bundle and assets; a separate native build produces the installable `.apk`.

The `preview` profile in `eas.json` produces an APK for direct installation. The `production` profile produces an AAB for Google Play.

## Prepare the release

1. Choose a release version and set `expo.version` in `app.json`. Update the root versions in `package.json` and `package-lock.json` to match. The app's settings read the version directly from `app.json`.
2. This project uses `cli.appVersionSource: "local"` in `eas.json`. Increment `expo.android.versionCode` in `app.json` for each release. Version `1.1.0` uses code `2`. See [Expo app version management](https://docs.expo.dev/build-reference/app-versions/).
3. Move the relevant notes from **Unreleased** in `CHANGELOG.md` into a section with the chosen version and release date.
4. Run the checks listed in the README. Record any remaining limitations honestly, including whether the APK was tested on a physical Android device.
5. Commit the feature, tests, version changes, and documentation, then push that commit to GitHub. Build from that source and use the same commit as the release tag target.

For the custom deck feature, a suitable commit message is `Add language-scoped custom decks`.

## Generate the APK

Run from the project directory, using the Expo account that owns the configured EAS project:

```sh
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview
```

If already signed in to the correct account, skip the login command. On Windows PowerShell, use `npx.cmd` if the execution policy blocks `npx.ps1`.

Use the existing Android signing credentials for `it.university.opentaboo`, so the APK can update the installed app. When the build finishes, EAS provides a build details page and an APK download link. Download the file and give it a versioned name, such as `Open-Taboo-vX.Y.Z.apk`, replacing `X.Y.Z` with the chosen release version.

The cloud build uploads the project to Expo and uses the account's EAS Build allowance. See [Expo's APK build guide](https://docs.expo.dev/build-reference/apk/).

Store local APK downloads in `artifacts/`, which is excluded from Git. Test the new APK over the existing installation and verify that saved data and custom decks are preserved.

## Publish on GitHub

1. Open the repository's [Releases](https://github.com/PaoloConteDev/OpenTaboo/releases) page and choose **Draft a new release**.
2. Create a tag for the chosen version, targeting the exact source commit used for the build.
3. Use that version as the release title and copy its notes from `CHANGELOG.md` into the description. Include the validation performed and any remaining limitations.
4. Attach the versioned `.apk` as a release asset. Keep the binary out of the source tree.
5. Check the tag, notes, and attached APK, then publish. Use a prerelease if it is intended for testing.

Updating the README or pushing a commit does not replace an APK attached to an existing release. Publish the new binary with the matching release notes and tag. See [GitHub's release documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository).

## Publish version 1.1.0 from this checkout

Version `1.1.0` and Android code `2` are configured in the source. The earlier `Open-Taboo-mazzi-separati.apk` uses version `1.0.0`; use the rebuilt `artifacts/Open-Taboo-v1.1.0.apk` for this release.

From the project directory, review and publish the source:

```sh
git add App.tsx app.json eas.json package.json package-lock.json README.md CHANGELOG.md src tests docs
git diff --cached --stat
git commit -m "Release v1.1.0: custom decks"
git tag -a v1.1.0 -m "Open Taboo 1.1.0"
git push origin main
git push origin v1.1.0
```

Then open the repository's Releases page, choose **Draft a new release**, select the existing `v1.1.0` tag, and set the title to **Open Taboo 1.1.0**. Paste the contents of [RELEASE_NOTES_1.1.0.md](RELEASE_NOTES_1.1.0.md) and attach `Open-Taboo-v1.1.0.apk` and its `.sha256` file from `artifacts/`. Publish when the APK has passed your device checks. The binary stays outside Git and is distributed as a release asset.
