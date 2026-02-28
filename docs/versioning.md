# Versioning

## Intended Version Sources

The version script (`scripts/bump-version.ts`) treats these files as version targets:

- `hyfenative.config.ts`
  - `app.version`
  - `app.buildNumber`
  - `app.versionCode`
- `package.json`
  - `version`
- `android/app/build.gradle`
  - `defaultConfig.versionCode`
  - `defaultConfig.versionName`

## Bump Commands

```bash
npm run bump -- --patch
npm run bump -- --minor
npm run bump -- --major
npm run bump -- --patch --preid=beta
npm run bump -- --release
```

Supported flags:

- `--patch`, `--minor`, `--major`
- `--preid=<id>` (e.g. `beta`, `rc`)
- `--release` (defaults to patch if bump type omitted)
- `--dry-run`

## Release Mode Behavior

`--release` performs:

1. `git add .`
2. `git commit -m "release: v<version>"`
3. `git tag v<version>`
4. `git push`
5. `git push origin v<version>`

## Android Update Strategy

The script now edits `android/app/build.gradle` directly by replacing:

- `versionCode <number>`
- `versionName "<semver>"`

If these entries cannot be found, the script throws an error and stops.

## Team Workflow Recommendation

- Use `--dry-run` in CI validation for release PRs.
- Keep pre-release tags for QA (`beta`, `rc`) and stable tags for production.
- Require clean working tree before `--release`.
