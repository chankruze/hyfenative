import fs from 'fs-extra';
import path from 'path';
import { execFileSync } from 'child_process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import configModule, { HyfenativeConfig } from '../hyfenative.config';

type CliArgs = {
  name: string;
  id: string;
  dryRun?: boolean;
  commit?: boolean;
};

const JAVA_PACKAGE_REGEX = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;

/* =========================================================
   UTIL
========================================================= */

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
}

function ensureValidName(name: string) {
  if (!name.trim()) throw new Error('--name is required');
}

function ensureValidPackage(id: string) {
  if (!JAVA_PACKAGE_REGEX.test(id)) {
    throw new Error('--id must be valid Java package');
  }
}

function renderConfig(config: HyfenativeConfig): string {
  return `import type { HyfenativeConfig } from './hyfenative.config.types';

const config: HyfenativeConfig = ${JSON.stringify(config, null, 2)};

export default config;
`;
}

/* =========================================================
   SAFE FILE WRITE
========================================================= */

async function safeWrite(file: string, content: string, dryRun: boolean) {
  if (dryRun) return;
  await fs.writeFile(file, content);
}

/* =========================================================
   VALIDATION
========================================================= */

async function validateRename(root: string, expectedPackage: string) {
  const buildGradle = await fs.readFile(
    path.join(root, 'android/app/build.gradle'),
    'utf8',
  );

  if (!buildGradle.includes(`namespace "${expectedPackage}"`)) {
    throw new Error('Validation failed: namespace mismatch');
  }

  if (!buildGradle.includes(`applicationId "${expectedPackage}"`)) {
    throw new Error('Validation failed: applicationId mismatch');
  }

  const manifest = await fs.readFile(
    path.join(root, 'android/app/src/main/AndroidManifest.xml'),
    'utf8',
  );

  if (!manifest.includes(`package="${expectedPackage}"`)) {
    throw new Error('Validation failed: manifest package mismatch');
  }
}

/* =========================================================
   BACKUP + ROLLBACK
========================================================= */

async function createBackup(root: string) {
  const backupDir = path.join(root, '.hyfenative-backup');
  await fs.remove(backupDir);
  await fs.copy(root, backupDir, {
    filter: (src: string) => !src.includes('node_modules'),
  });
}

async function restoreBackup(root: string) {
  const backupDir = path.join(root, '.hyfenative-backup');
  if (await fs.pathExists(backupDir)) {
    await fs.copy(backupDir, root, { overwrite: true });
    await fs.remove(backupDir);
  }
}

/* =========================================================
   GIT
========================================================= */

function gitCommit(message: string) {
  execFileSync('git', ['add', '.']);
  execFileSync('git', ['commit', '-m', message]);
}

/* =========================================================
   MAIN
========================================================= */

async function main() {
  const argv = (await yargs(hideBin(process.argv))
    .option('name', { type: 'string', demandOption: true })
    .option('id', { type: 'string', demandOption: true })
    .option('dry-run', { type: 'boolean' })
    .option('commit', { type: 'boolean' })
    .parse()) as CliArgs;

  ensureValidName(argv.name);
  ensureValidPackage(argv.id);

  const root = process.cwd();
  const configPath = path.join(root, 'hyfenative.config.ts');

  const existing: HyfenativeConfig = configModule;

  const dryRun = argv.dryRun ?? false;

  if (!dryRun) await createBackup(root);

  try {
    const next: HyfenativeConfig = {
      ...existing,
      app: {
        ...existing.app,
        name: argv.name,
        slug: slugify(argv.name),
        scheme: slugify(argv.name),
      },
      android: { package: argv.id },
      ios: { bundleId: argv.id },
    };

    await safeWrite(configPath, renderConfig(next), dryRun);
    console.log('✔ Updated hyfenative.config.ts');

    const buildGradlePath = path.join(root, 'android/app/build.gradle');
    let buildGradle = await fs.readFile(buildGradlePath, 'utf8');

    buildGradle = buildGradle.replace(
      /^\s*namespace\s+["'][^"']+["']/m,
      `namespace "${argv.id}"`,
    );

    buildGradle = buildGradle.replace(
      /^\s*applicationId\s+["'][^"']+["']/m,
      `applicationId "${argv.id}"`,
    );

    await safeWrite(buildGradlePath, buildGradle, dryRun);
    console.log('✔ Updated namespace + applicationId');

    const manifestPath = path.join(
      root,
      'android/app/src/main/AndroidManifest.xml',
    );

    let manifest = await fs.readFile(manifestPath, 'utf8');

    manifest = manifest.replace(
      /<manifest([^>]*?)\spackage="[^"]*"/,
      `<manifest$1 package="${argv.id}"`,
    );

    await safeWrite(manifestPath, manifest, dryRun);
    console.log('✔ Updated AndroidManifest.xml');

    if (!dryRun) await validateRename(root, argv.id);
    console.log('✔ Validation passed');

    if (argv.commit && !dryRun) {
      gitCommit(`chore: configure app to ${argv.id}`);
      console.log('✔ Git commit created');
    }

    console.log('✔ Configuration complete');

    if (!dryRun) {
      await fs.remove(path.join(root, '.hyfenative-backup'));
    }
  } catch (err) {
    console.error('✖ Error occurred. Rolling back...');
    await restoreBackup(root);
    throw err;
  }
}

main().catch(e => {
  console.error(e.message);
  process.exit(1);
});
