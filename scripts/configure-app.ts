import fs from 'fs-extra';
import path from 'path';
import { execFileSync } from 'child_process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { config, HyfenativeConfig } from '../hyfenative.config';

type CliArgs = {
  name: string;
  id: string;
  dryRun?: boolean;
  commit?: boolean;
};

const JAVA_PACKAGE_REGEX = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;

const FILES_TO_UPDATE = [
  'hyfenative.config.ts',
  'android/app/build.gradle',
  'android/gradle.properties',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src',
  'ios/AppConfig.xcconfig',
  'ios/hyfenative.xcodeproj/project.pbxproj',
];

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
    throw new Error('--id must be a valid Java package (e.g. com.example.app)');
  }
}

/* =========================================================
   BACKUP (SAFE + SELECTIVE)
========================================================= */

async function createBackup(root: string) {
  const backupDir = path.join(root, '.hyfenative-backup');
  await fs.remove(backupDir);
  await fs.mkdir(backupDir);

  for (const file of FILES_TO_UPDATE) {
    const src = path.join(root, file);
    if (!(await fs.pathExists(src))) continue;

    const dest = path.join(backupDir, file);
    await fs.ensureDir(path.dirname(dest));
    await fs.copy(src, dest);
  }
}

async function restoreBackup(root: string) {
  const backupDir = path.join(root, '.hyfenative-backup');
  if (!(await fs.pathExists(backupDir))) return;

  await fs.copy(backupDir, root, { overwrite: true });
  await fs.remove(backupDir);
}

/* =========================================================
   SAFE WRITE
========================================================= */

async function safeWrite(file: string, content: string, dryRun: boolean) {
  if (dryRun) {
    console.log(`[dry-run] Would update ${file}`);
    return;
  }

  await fs.writeFile(file, content);
}

async function listSourceFiles(dir: string): Promise<string[]> {
  if (!(await fs.pathExists(dir))) return [];

  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listSourceFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && /\.(kt|java)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function rewriteAndroidPackageStatements(
  sourceRoot: string,
  oldPackage: string,
  newPackage: string,
  dryRun: boolean,
) {
  const files = await listSourceFiles(sourceRoot);

  for (const file of files) {
    let content = await fs.readFile(file, 'utf8');
    const updated = content
      .replace(
        new RegExp(`(^\\s*package\\s+)${oldPackage.replace(/\./g, '\\.')}(\\b)`, 'm'),
        `$1${newPackage}$2`,
      )
      .replace(
        new RegExp(`(^\\s*import\\s+)${oldPackage.replace(/\./g, '\\.')}(\\.)`, 'gm'),
        `$1${newPackage}$2`,
      );

    if (updated !== content) {
      await safeWrite(file, updated, dryRun);
    }
  }
}

async function moveAndroidNamespaceDirs(
  root: string,
  oldPackage: string,
  newPackage: string,
  dryRun: boolean,
) {
  if (oldPackage === newPackage) return;

  const oldPackagePath = oldPackage.split('.').join(path.sep);
  const newPackagePath = newPackage.split('.').join(path.sep);
  const sourceSetsRoot = path.join(root, 'android/app/src');

  if (!(await fs.pathExists(sourceSetsRoot))) return;

  const sourceSets = await fs.readdir(sourceSetsRoot);
  for (const sourceSet of sourceSets) {
    for (const language of ['java', 'kotlin']) {
      const sourceRoot = path.join(sourceSetsRoot, sourceSet, language);
      if (!(await fs.pathExists(sourceRoot))) continue;

      const oldDir = path.join(sourceRoot, oldPackagePath);
      const newDir = path.join(sourceRoot, newPackagePath);

      if (await fs.pathExists(oldDir)) {
        if (dryRun) {
          console.log(`[dry-run] Would move ${oldDir} -> ${newDir}`);
        } else {
          await fs.ensureDir(path.dirname(newDir));

          if (await fs.pathExists(newDir)) {
            await fs.copy(oldDir, newDir, { overwrite: true });
            await fs.remove(oldDir);
          } else {
            await fs.move(oldDir, newDir);
          }
        }
      }

      await rewriteAndroidPackageStatements(sourceRoot, oldPackage, newPackage, dryRun);
    }
  }
}

async function updateIosBundleId(root: string, bundleId: string, dryRun: boolean) {
  const appConfigPath = path.join(root, 'ios/AppConfig.xcconfig');
  if (await fs.pathExists(appConfigPath)) {
    let appConfig = await fs.readFile(appConfigPath, 'utf8');

    if (/^PRODUCT_BUNDLE_IDENTIFIER\s*=.+$/m.test(appConfig)) {
      appConfig = appConfig.replace(
        /^PRODUCT_BUNDLE_IDENTIFIER\s*=.+$/m,
        `PRODUCT_BUNDLE_IDENTIFIER = ${bundleId}`,
      );
    } else {
      appConfig = `${appConfig.trimEnd()}\nPRODUCT_BUNDLE_IDENTIFIER = ${bundleId}\n`;
    }

    await safeWrite(appConfigPath, appConfig, dryRun);
    console.log('✔ Updated ios/AppConfig.xcconfig');
  }

  const pbxprojPath = path.join(root, 'ios/hyfenative.xcodeproj/project.pbxproj');
  if (await fs.pathExists(pbxprojPath)) {
    const pbxproj = await fs.readFile(pbxprojPath, 'utf8');
    const updatedPbxproj = pbxproj.replace(
      /(PRODUCT_BUNDLE_IDENTIFIER\s*=\s*)[^;]+;/g,
      `$1"${bundleId}";`,
    );

    await safeWrite(pbxprojPath, updatedPbxproj, dryRun);
    console.log('✔ Updated iOS project bundle identifiers');
  }
}

/* =========================================================
   VALIDATION
========================================================= */

async function validateRename(root: string, expectedPackage: string) {
  const buildGradle = await fs.readFile(
    path.join(root, 'android/app/build.gradle'),
    'utf8',
  );

  const namespaceRegex = /\bnamespace\s+["']([^"']+)["']/;
  const namespaceMatch = buildGradle.match(namespaceRegex);
  if (!namespaceMatch || namespaceMatch[1] !== expectedPackage) {
    throw new Error('Validation failed: namespace mismatch');
  }

  const appIdLiteralRegex = /\bapplicationId\s+["']([^"']+)["']/;
  const appIdLiteralMatch = buildGradle.match(appIdLiteralRegex);

  if (appIdLiteralMatch) {
    if (appIdLiteralMatch[1] !== expectedPackage) {
      throw new Error('Validation failed: applicationId mismatch');
    }
  } else if (buildGradle.includes('applicationId project.APP_ID')) {
    const gradleProperties = await fs.readFile(
      path.join(root, 'android/gradle.properties'),
      'utf8',
    );

    const appIdPropMatch = gradleProperties.match(/^APP_ID=(.+)$/m);
    if (!appIdPropMatch || appIdPropMatch[1].trim() !== expectedPackage) {
      throw new Error(
        'Validation failed: APP_ID mismatch in gradle.properties',
      );
    }
  } else {
    throw new Error('Validation failed: applicationId not found');
  }

  const manifest = await fs.readFile(
    path.join(root, 'android/app/src/main/AndroidManifest.xml'),
    'utf8',
  );

  const manifestPackageMatch = manifest.match(
    /<manifest[^>]*\spackage="([^"]+)"/,
  );

  // On newer Android setups package can be omitted from the manifest.
  if (manifestPackageMatch && manifestPackageMatch[1] !== expectedPackage) {
    throw new Error('Validation failed: manifest package mismatch');
  }
}

/* =========================================================
   GIT
========================================================= */

function gitCommit(message: string) {
  execFileSync('git', ['add', '.'], { stdio: 'inherit' });
  execFileSync('git', ['commit', '-m', message], { stdio: 'inherit' });
}

/* =========================================================
   MAIN
========================================================= */

async function main() {
  const argv = (await yargs(hideBin(process.argv))
    .option('name', { type: 'string', demandOption: true })
    .option('id', { type: 'string', demandOption: true })
    .option('dry-run', { type: 'boolean', default: false })
    .option('commit', { type: 'boolean', default: false })
    .strict()
    .parse()) as CliArgs;

  ensureValidName(argv.name);
  ensureValidPackage(argv.id);

  const root = process.cwd();
  const configPath = path.join(root, 'hyfenative.config.ts');

  const existing: HyfenativeConfig = config;
  const dryRun = argv.dryRun ?? false;
  const oldAndroidPackage = existing.android.package;

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

    let configContent = await fs.readFile(configPath, 'utf8');

    configContent = configContent
      .replace(/name:\s*['"`][^'"`]+['"`]/, `name: '${argv.name}'`)
      .replace(/slug:\s*['"`][^'"`]+['"`]/, `slug: '${slugify(argv.name)}'`)
      .replace(/scheme:\s*['"`][^'"`]+['"`]/, `scheme: '${slugify(argv.name)}'`)
      .replace(/package:\s*['"`][^'"`]+['"`]/, `package: '${argv.id}'`)
      .replace(/bundleId:\s*['"`][^'"`]+['"`]/, `bundleId: '${argv.id}'`);

    await safeWrite(configPath, configContent, dryRun);
    console.log('✔ Updated hyfenative.config.ts');

    // Update build.gradle
    const gradlePath = path.join(root, 'android/app/build.gradle');
    let buildGradle = await fs.readFile(gradlePath, 'utf8');

    const originalBuildGradle = buildGradle;

    buildGradle = buildGradle.replace(
      /(defaultConfig\s*{[\s\S]*?applicationId\s+["'])[^"']+(["'])/,
      `$1${argv.id}$2`,
    );

    buildGradle = buildGradle.replace(
      /(\bnamespace\s+["'])[^"']+(["'])/,
      `$1${argv.id}$2`,
    );

    const usesProjectAppId = /applicationId\s+project\.APP_ID/.test(
      buildGradle,
    );
    const changedBuildGradle = buildGradle !== originalBuildGradle;

    await safeWrite(gradlePath, buildGradle, dryRun);
    console.log('✔ Updated namespace + applicationId reference');

    if (usesProjectAppId) {
      const gradlePropertiesPath = path.join(root, 'android/gradle.properties');
      let gradleProperties = await fs.readFile(gradlePropertiesPath, 'utf8');

      if (/^APP_ID=.+$/m.test(gradleProperties)) {
        gradleProperties = gradleProperties.replace(
          /^APP_ID=.+$/m,
          `APP_ID=${argv.id}`,
        );
      } else {
        gradleProperties = `${gradleProperties.trimEnd()}\nAPP_ID=${argv.id}\n`;
      }

      await safeWrite(gradlePropertiesPath, gradleProperties, dryRun);
      console.log('✔ Updated android/gradle.properties APP_ID');
    } else if (!changedBuildGradle) {
      throw new Error(
        'Unable to update applicationId in android/app/build.gradle',
      );
    }

    // Update AndroidManifest
    const manifestPath = path.join(
      root,
      'android/app/src/main/AndroidManifest.xml',
    );

    let manifest = await fs.readFile(manifestPath, 'utf8');

    if (/<manifest[^>]*\spackage="[^"]*"/.test(manifest)) {
      manifest = manifest.replace(
        /<manifest([^>]*?)\spackage="[^"]*"/,
        `<manifest$1 package="${argv.id}"`,
      );
    }

    await safeWrite(manifestPath, manifest, dryRun);
    console.log('✔ Updated AndroidManifest.xml');

    await moveAndroidNamespaceDirs(root, oldAndroidPackage, argv.id, dryRun);
    console.log('✔ Updated Android package directories');

    await updateIosBundleId(root, argv.id, dryRun);

    if (!dryRun) {
      await validateRename(root, argv.id);
      await fs.remove(path.join(root, '.hyfenative-backup'));
    }

    console.log('✔ Validation passed');
    console.log('✔ Configuration complete');

    if (argv.commit && !dryRun) {
      gitCommit(`chore: configure app to ${argv.id}`);
      console.log('✔ Git commit created');
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
