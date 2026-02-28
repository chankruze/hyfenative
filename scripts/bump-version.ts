import fs from 'fs-extra';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { execFileSync } from 'child_process';

const SEMVER_REGEX = /^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9]+)\.(\d+))?$/;

type BumpType = 'patch' | 'minor' | 'major';

function parseVersion(version: string) {
  const match = version.match(SEMVER_REGEX);
  if (!match) throw new Error('Invalid semantic version');

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    preid: match[4],
    preNumber: match[5] ? Number(match[5]) : undefined,
  };
}

function buildVersion(
  major: number,
  minor: number,
  patch: number,
  preid?: string,
  preNumber?: number,
) {
  if (preid) return `${major}.${minor}.${patch}-${preid}.${preNumber ?? 0}`;
  return `${major}.${minor}.${patch}`;
}

function bumpVersion(current: string, type: BumpType, preid?: string) {
  const v = parseVersion(current);

  if (preid) {
    if (v.preid === preid) {
      return buildVersion(
        v.major,
        v.minor,
        v.patch,
        preid,
        (v.preNumber ?? 0) + 1,
      );
    }

    // convert normal version → prerelease
    const next = bumpVersion(current, type);
    const parsed = parseVersion(next);
    return buildVersion(parsed.major, parsed.minor, parsed.patch, preid, 0);
  }

  if (type === 'patch') return buildVersion(v.major, v.minor, v.patch + 1);
  if (type === 'minor') return buildVersion(v.major, v.minor + 1, 0);
  if (type === 'major') return buildVersion(v.major + 1, 0, 0);

  return current;
}

function git(args: string[], dryRun: boolean) {
  if (dryRun) {
    console.log('[dry-run] git', args.join(' '));
    return;
  }
  execFileSync('git', args, { stdio: 'inherit' });
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('patch', { type: 'boolean' })
    .option('minor', { type: 'boolean' })
    .option('major', { type: 'boolean' })
    .option('release', { type: 'boolean' })
    .option('dry-run', { type: 'boolean' })
    .option('preid', { type: 'string' })
    .strict()
    .parse();

  let type: BumpType | undefined = argv.patch
    ? 'patch'
    : argv.minor
    ? 'minor'
    : argv.major
    ? 'major'
    : undefined;

  if (argv.release && !type) type = 'patch';
  if (!type) throw new Error('Specify --patch, --minor, --major or --release');

  const dryRun = argv['dry-run'] ?? false;

  const root = process.cwd();
  const configPath = path.join(root, 'hyfenative.config.ts');
  const packageJsonPath = path.join(root, 'package.json');
  const androidBuildGradlePath = path.join(root, 'android/app/build.gradle');

  let configContent = await fs.readFile(configPath, 'utf8');

  const versionMatch = configContent.match(/version:\s*['"]([^'"]+)['"]/);
  const buildMatch = configContent.match(/buildNumber:\s*(\d+)/);
  const codeMatch = configContent.match(/versionCode:\s*(\d+)/);

  if (!versionMatch || !buildMatch || !codeMatch) {
    throw new Error('Could not locate version fields in config');
  }

  const oldVersion = versionMatch[1];
  const newVersion = bumpVersion(oldVersion, type, argv.preid);

  const newBuild = Number(buildMatch[1]) + 1;
  const newCode = Number(codeMatch[1]) + 1;

  configContent = configContent.replace(
    /version:\s*['"][^'"]+['"]/,
    `version: '${newVersion}'`,
  );

  configContent = configContent.replace(
    /buildNumber:\s*\d+/,
    `buildNumber: ${newBuild}`,
  );

  configContent = configContent.replace(
    /versionCode:\s*\d+/,
    `versionCode: ${newCode}`,
  );

  if (!dryRun) await fs.writeFile(configPath, configContent);

  /* package.json */
  const packageJson = await fs.readJson(packageJsonPath);
  packageJson.version = newVersion;
  if (!dryRun) await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  /* Android */
  let androidBuildGradle = await fs.readFile(androidBuildGradlePath, 'utf8');

  const nextBuildGradle = androidBuildGradle
    .replace(/^\s*versionCode\s+\d+/m, `        versionCode ${newCode}`)
    .replace(
      /^\s*versionName\s+["'][^"']+["']/m,
      `        versionName "${newVersion}"`,
    );

  if (nextBuildGradle === androidBuildGradle) {
    throw new Error(
      'Could not locate Android versionCode/versionName in android/app/build.gradle',
    );
  }

  androidBuildGradle = nextBuildGradle;

  if (!dryRun) await fs.writeFile(androidBuildGradlePath, androidBuildGradle);

  console.log(`✔ Version bumped: ${oldVersion} → ${newVersion}`);

  if (argv.release) {
    console.log('🚀 Running release flow...');

    git(['add', '.'], dryRun);
    git(['commit', '-m', `release: v${newVersion}`], dryRun);
    git(['tag', `v${newVersion}`], dryRun);
    git(['push'], dryRun);
    git(['push', 'origin', `v${newVersion}`], dryRun);

    console.log(`✔ Tag v${newVersion} created`);
  }

  console.log(dryRun ? '✔ Dry run complete' : '✔ Release complete');
}

main().catch(err => {
  console.error('✖', err.message);
  process.exit(1);
});
