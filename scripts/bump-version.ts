import fs from 'fs-extra';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

type BumpType = 'patch' | 'minor' | 'major';

function bump(version: string, type: BumpType) {
  if (!SEMVER_REGEX.test(version)) {
    throw new Error('Invalid semantic version');
  }

  const [major, minor, patch] = version.split('.').map(Number);

  if (type === 'patch') return `${major}.${minor}.${patch + 1}`;
  if (type === 'minor') return `${major}.${minor + 1}.0`;
  if (type === 'major') return `${major + 1}.0.0`;

  return version;
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('patch', { type: 'boolean' })
    .option('minor', { type: 'boolean' })
    .option('major', { type: 'boolean' })
    .strict()
    .parse();

  const type: BumpType | undefined = argv.patch
    ? 'patch'
    : argv.minor
    ? 'minor'
    : argv.major
    ? 'major'
    : undefined;

  if (!type) {
    throw new Error('Specify --patch, --minor, or --major');
  }

  const root = process.cwd();
  const configPath = path.join(root, 'hyfenative.config.ts');
  const packageJsonPath = path.join(root, 'package.json');
  const gradlePropsPath = path.join(root, 'android/gradle.properties');

  let configContent = await fs.readFile(configPath, 'utf8');

  const versionMatch = configContent.match(/version:\s*['"]([^'"]+)['"]/);
  const buildMatch = configContent.match(/buildNumber:\s*(\d+)/);
  const codeMatch = configContent.match(/versionCode:\s*(\d+)/);

  if (!versionMatch || !buildMatch || !codeMatch) {
    throw new Error('Could not locate version fields in config');
  }

  const oldVersion = versionMatch[1];
  const newVersion = bump(oldVersion, type);

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

  await fs.writeFile(configPath, configContent);

  /* -------------------------
     Update package.json
  -------------------------- */

  const packageJson = await fs.readJson(packageJsonPath);
  packageJson.version = newVersion;
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  /* -------------------------
     Update Android
  -------------------------- */

  let gradleContent = await fs.readFile(gradlePropsPath, 'utf8');

  gradleContent = gradleContent.replace(
    /VERSION_NAME=.*/g,
    `VERSION_NAME=${newVersion}`,
  );

  gradleContent = gradleContent.replace(
    /VERSION_CODE=.*/g,
    `VERSION_CODE=${newCode}`,
  );

  await fs.writeFile(gradlePropsPath, gradleContent);

  /* -------------------------
     Update iOS
  -------------------------- */

  const iosDir = path.join(root, 'ios');
  const entries = await fs.readdir(iosDir);

  for (const entry of entries) {
    if (!entry.endsWith('.xcodeproj')) continue;

    const pbx = path.join(iosDir, entry, 'project.pbxproj');
    let content = await fs.readFile(pbx, 'utf8');

    content = content.replace(
      /MARKETING_VERSION = .*?;/g,
      `MARKETING_VERSION = ${newVersion};`,
    );

    content = content.replace(
      /CURRENT_PROJECT_VERSION = .*?;/g,
      `CURRENT_PROJECT_VERSION = ${newBuild};`,
    );

    await fs.writeFile(pbx, content);
  }

  console.log(`✔ Version bumped: ${oldVersion} → ${newVersion}`);
  console.log(`✔ package.json updated`);
  console.log(`✔ Android VERSION_NAME + VERSION_CODE updated`);
  console.log(`✔ iOS MARKETING_VERSION + CURRENT_PROJECT_VERSION updated`);
  console.log('✔ Version bump complete');
}

main().catch(err => {
  console.error('✖', err.message);
  process.exit(1);
});
