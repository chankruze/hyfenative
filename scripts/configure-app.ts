import fs from 'fs-extra';
import * as path from 'path';
import { execFileSync } from 'child_process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

type HyfenativeConfig = {
  app: {
    name: string;
    slug: string;
    scheme: string;
  };
  android: {
    package: string;
  };
  ios: {
    bundleId: string;
  };
};

type CliArgs = {
  name: string;
  id: string;
};

const JAVA_PACKAGE_REGEX = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;

function slugifyName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  if (!slug) {
    throw new Error('Derived slug is empty. Please provide a valid --name.');
  }

  return slug;
}

function toPackageJsonName(slug: string): string {
  return slug.replace(/-/g, '');
}

function ensureValidName(name: string): void {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error('--name is required.');
  }

  if (!/^[A-Za-z0-9][A-Za-z0-9 _-]*$/.test(trimmed)) {
    throw new Error('--name contains illegal characters. Use letters, digits, spaces, hyphen, and underscore only.');
  }
}

function ensureValidPackageId(id: string): void {
  if (!JAVA_PACKAGE_REGEX.test(id)) {
    throw new Error('--id must be a valid Java package id (example: com.client.app).');
  }
}

function renderConfig(config: HyfenativeConfig): string {
  return `export type HyfenativeConfig = {
  app: {
    name: string;
    slug: string;
    scheme: string;
  };
  android: {
    package: string;
  };
  ios: {
    bundleId: string;
  };
};

const config: HyfenativeConfig = {
  app: {
    name: '${config.app.name}',
    slug: '${config.app.slug}',
    scheme: '${config.app.scheme}',
  },
  android: {
    package: '${config.android.package}',
  },
  ios: {
    bundleId: '${config.ios.bundleId}',
  },
};

export default config;
`;
}

function upsertKeyValueLine(content: string, key: string, value: string): string {
  const lines = content.split(/\r?\n/);
  const prefix = `${key}=`;
  const target = `${key}=${value}`;
  const index = lines.findIndex((line) => line.startsWith(prefix));

  if (index === -1) {
    const withTrailingNewline = content.length > 0 && !content.endsWith('\n') ? `${content}\n` : content;
    return `${withTrailingNewline}${target}\n`;
  }

  if (lines[index] === target) {
    return content;
  }

  lines[index] = target;
  return `${lines.join('\n')}\n`;
}

function upsertXcconfigLine(content: string, key: string, value: string): string {
  const lines = content.split(/\r?\n/);
  const prefix = `${key} =`;
  const target = `${key} = ${value}`;
  const index = lines.findIndex((line) => line.trimStart().startsWith(prefix));

  if (index === -1) {
    const withTrailingNewline = content.length > 0 && !content.endsWith('\n') ? `${content}\n` : content;
    return `${withTrailingNewline}${target}\n`;
  }

  if (lines[index].trim() === target) {
    return content;
  }

  lines[index] = target;
  return `${lines.join('\n')}\n`;
}

function normalizeArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function replaceGradleKey(fileContent: string, key: 'applicationId', value: string): string {
  const lines = fileContent.split(/\r?\n/);
  const keyRegex = new RegExp(`^\\s*${key}\\s+`);
  let replaced = false;

  for (let i = 0; i < lines.length; i += 1) {
    if (keyRegex.test(lines[i])) {
      const indent = lines[i].match(/^\s*/)?.[0] ?? '';
      const next = `${indent}${key} ${value}`;
      if (lines[i] !== next) {
        lines[i] = next;
      }
      replaced = true;
      break;
    }
  }

  if (!replaced) {
    const defaultConfigIndex = lines.findIndex((line) => /^\s*defaultConfig\s*\{\s*$/.test(line));
    if (defaultConfigIndex === -1) {
      throw new Error('Could not find defaultConfig block in android/app/build.gradle.');
    }

    const indent = (lines[defaultConfigIndex].match(/^\s*/)?.[0] ?? '') + '    ';
    lines.splice(defaultConfigIndex + 1, 0, `${indent}${key} ${value}`);
    replaced = true;
  }

  if (!replaced) {
    throw new Error(`Could not set ${key} in android/app/build.gradle.`);
  }

  return `${lines.join('\n')}\n`;
}

function updateAndroidManifest(
  fileContent: string,
  oldPackage: string,
  newPackage: string,
  oldScheme: string,
  newScheme: string,
): { content: string; changedPackage: boolean; changedScheme: boolean } {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });

  const xml = parser.parse(fileContent) as {
    manifest: {
      '@_package'?: string;
      application?: {
        activity?: Array<Record<string, unknown>> | Record<string, unknown>;
      };
    };
  };

  if (!xml.manifest) {
    throw new Error('Invalid AndroidManifest.xml: missing <manifest>.');
  }

  const manifest = xml.manifest;
  const currentPackage = manifest['@_package'];
  let changedPackage = false;

  if (!currentPackage || currentPackage === oldPackage || currentPackage !== newPackage) {
    manifest['@_package'] = newPackage;
    changedPackage = currentPackage !== newPackage;
  }

  let changedScheme = false;
  const application = manifest.application;
  if (application) {
    const activities = normalizeArray(application.activity);
    const mainActivity =
      activities.find((activity) => {
        const name = (activity['@_android:name'] ?? activity['@_name']) as string | undefined;
        return name === '.MainActivity' || name?.endsWith('MainActivity');
      }) ?? activities[0];

    if (mainActivity) {
      const intentFilters = normalizeArray(mainActivity['intent-filter'] as Record<string, unknown> | Record<string, unknown>[]);

      for (const filter of intentFilters) {
        const dataEntries = normalizeArray(filter.data as Record<string, unknown> | Record<string, unknown>[]);
        for (const data of dataEntries) {
          const key = '@_android:scheme';
          if (typeof data[key] === 'string' && data[key] === oldScheme && oldScheme !== newScheme) {
            data[key] = newScheme;
            changedScheme = true;
          }
        }
      }

      const hasScheme = intentFilters.some((filter) => {
        const dataEntries = normalizeArray(filter.data as Record<string, unknown> | Record<string, unknown>[]);
        return dataEntries.some((data) => data['@_android:scheme'] === newScheme);
      });

      if (!hasScheme) {
        intentFilters.push({
          action: { '@_android:name': 'android.intent.action.VIEW' },
          category: [
            { '@_android:name': 'android.intent.category.DEFAULT' },
            { '@_android:name': 'android.intent.category.BROWSABLE' },
          ],
          data: { '@_android:scheme': newScheme },
        });
        mainActivity['intent-filter'] = intentFilters;
        changedScheme = true;
      }
    }
  }

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    format: true,
    suppressEmptyNode: true,
  });

  const content = `${builder.build(xml)}\n`;
  return { content, changedPackage, changedScheme };
}

function readPlistJson(plistPath: string): Record<string, unknown> {
  const json = execFileSync('plutil', ['-convert', 'json', '-o', '-', plistPath], {
    encoding: 'utf8',
  });

  return JSON.parse(json) as Record<string, unknown>;
}

function writePlistJson(plistPath: string, data: Record<string, unknown>): void {
  const tempJsonPath = `${plistPath}.tmp.json`;
  fs.writeFileSync(tempJsonPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  execFileSync('plutil', ['-convert', 'xml1', '-o', plistPath, tempJsonPath]);
  fs.removeSync(tempJsonPath);
}

function updatePbxprojBundleId(content: string, bundleId: string): { content: string; changed: boolean } {
  const lines = content.split(/\r?\n/);
  let changed = false;

  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].includes('PRODUCT_BUNDLE_IDENTIFIER =')) {
      const indent = lines[i].match(/^\s*/)?.[0] ?? '';
      const next = `${indent}PRODUCT_BUNDLE_IDENTIFIER = ${bundleId};`;
      if (lines[i] !== next) {
        lines[i] = next;
        changed = true;
      }
    }
  }

  return { content: `${lines.join('\n')}\n`, changed };
}

async function findIosInfoPlist(iosDir: string): Promise<string> {
  const entries = await fs.readdir(iosDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const candidate = path.join(iosDir, entry.name, 'Info.plist');
    if (await fs.pathExists(candidate)) {
      return candidate;
    }
  }

  throw new Error('Could not find iOS Info.plist under ios/*/Info.plist.');
}

async function findXcodeProjectFile(iosDir: string): Promise<string> {
  const entries = await fs.readdir(iosDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.endsWith('.xcodeproj')) continue;
    const candidate = path.join(iosDir, entry.name, 'project.pbxproj');
    if (await fs.pathExists(candidate)) {
      return candidate;
    }
  }

  throw new Error('Could not find ios/*.xcodeproj/project.pbxproj.');
}

async function recursivelyFindFiles(rootDir: string, names: Set<string>): Promise<string[]> {
  const output: string[] = [];

  async function walk(dirPath: string): Promise<void> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (names.has(entry.name)) {
        output.push(fullPath);
      }
    }
  }

  if (await fs.pathExists(rootDir)) {
    await walk(rootDir);
  }

  return output;
}

function updatePackageDeclaration(content: string, nextPackage: string): { content: string; changed: boolean } {
  const lines = content.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    if (/^\s*package\s+[A-Za-z0-9_.]+\s*;?\s*$/.test(lines[i])) {
      const hasSemicolon = lines[i].trim().endsWith(';');
      const next = `package ${nextPackage}${hasSemicolon ? ';' : ''}`;
      const changed = lines[i] !== next;
      lines[i] = next;
      return { content: `${lines.join('\n')}\n`, changed };
    }

    if (lines[i].trim().length > 0) {
      break;
    }
  }

  return { content, changed: false };
}

async function loadExistingConfig(configPath: string): Promise<HyfenativeConfig> {
  if (!(await fs.pathExists(configPath))) {
    throw new Error('hyfenative.config.ts is missing. Please create it first.');
  }

  const imported = await import(configPath);
  const loaded = imported.default as HyfenativeConfig | undefined;

  if (!loaded?.app?.name || !loaded?.android?.package || !loaded?.ios?.bundleId) {
    throw new Error('hyfenative.config.ts is invalid.');
  }

  return loaded;
}

async function cleanupEmptyDirs(fromDir: string, stopDir: string): Promise<void> {
  let current = fromDir;
  const stop = path.resolve(stopDir);

  while (path.resolve(current).startsWith(stop) && path.resolve(current) !== stop) {
    const entries = await fs.readdir(current);
    if (entries.length > 0) {
      break;
    }

    await fs.remove(current);
    current = path.dirname(current);
  }
}

async function main(): Promise<void> {
  const argv = (await yargs(hideBin(process.argv))
    .option('name', {
      type: 'string',
      demandOption: true,
      describe: 'App display name (example: ClientApp)',
    })
    .option('id', {
      type: 'string',
      demandOption: true,
      describe: 'Package/bundle id (example: com.client.app)',
    })
    .strict()
    .parse()) as CliArgs;

  const appName = argv.name.trim();
  const appId = argv.id.trim();

  ensureValidName(appName);
  ensureValidPackageId(appId);

  const slug = slugifyName(appName);
  const scheme = slug.toLowerCase();
  const packageJsonName = toPackageJsonName(slug);

  if (!packageJsonName) {
    throw new Error('Derived package.json name is empty.');
  }

  const rootDir = process.cwd();
  const configPath = path.join(rootDir, 'hyfenative.config.ts');
  const existingConfig = await loadExistingConfig(configPath);

  const nextConfig: HyfenativeConfig = {
    app: {
      name: appName,
      slug,
      scheme,
    },
    android: {
      package: appId,
    },
    ios: {
      bundleId: appId,
    },
  };

  const noConfigChange =
    existingConfig.app.name === nextConfig.app.name &&
    existingConfig.app.slug === nextConfig.app.slug &&
    existingConfig.app.scheme === nextConfig.app.scheme &&
    existingConfig.android.package === nextConfig.android.package &&
    existingConfig.ios.bundleId === nextConfig.ios.bundleId;

  if (noConfigChange) {
    throw new Error('Requested values match current hyfenative.config.ts. Nothing to configure.');
  }

  const logs: string[] = [];

  await fs.writeFile(configPath, renderConfig(nextConfig), 'utf8');
  logs.push('✔ Updated hyfenative.config.ts');

  const gradlePropertiesPath = path.join(rootDir, 'android', 'gradle.properties');
  const gradlePropertiesContent = await fs.readFile(gradlePropertiesPath, 'utf8');
  let nextGradleProperties = upsertKeyValueLine(gradlePropertiesContent, 'APP_ID', appId);
  nextGradleProperties = upsertKeyValueLine(nextGradleProperties, 'APP_NAME', appName);
  if (nextGradleProperties !== gradlePropertiesContent) {
    await fs.writeFile(gradlePropertiesPath, nextGradleProperties, 'utf8');
  }
  logs.push('✔ Updated Android APP_ID');

  const buildGradlePath = path.join(rootDir, 'android', 'app', 'build.gradle');
  const buildGradleContent = await fs.readFile(buildGradlePath, 'utf8');
  const nextBuildGradle = replaceGradleKey(buildGradleContent, 'applicationId', 'project.APP_ID');
  if (nextBuildGradle !== buildGradleContent) {
    await fs.writeFile(buildGradlePath, nextBuildGradle, 'utf8');
  }

  const manifestPath = path.join(rootDir, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
  const manifestContent = await fs.readFile(manifestPath, 'utf8');
  const manifestUpdated = updateAndroidManifest(
    manifestContent,
    existingConfig.android.package,
    appId,
    existingConfig.app.scheme,
    scheme,
  );
  if (manifestUpdated.content !== manifestContent) {
    await fs.writeFile(manifestPath, manifestUpdated.content, 'utf8');
  }

  const javaRoot = path.join(rootDir, 'android', 'app', 'src', 'main', 'java');
  const oldPackagePath = path.join(javaRoot, ...existingConfig.android.package.split('.'));
  const newPackagePath = path.join(javaRoot, ...appId.split('.'));

  if (oldPackagePath !== newPackagePath && (await fs.pathExists(oldPackagePath)) && !(await fs.pathExists(newPackagePath))) {
    await fs.ensureDir(path.dirname(newPackagePath));
    await fs.move(oldPackagePath, newPackagePath, { overwrite: false });
    await cleanupEmptyDirs(path.dirname(oldPackagePath), javaRoot);
  }

  const entryFiles = await recursivelyFindFiles(javaRoot, new Set(['MainActivity.kt', 'MainActivity.java', 'MainApplication.kt', 'MainApplication.java']));

  for (const filePath of entryFiles) {
    const source = await fs.readFile(filePath, 'utf8');
    const updated = updatePackageDeclaration(source, appId);
    if (updated.changed) {
      await fs.writeFile(filePath, updated.content, 'utf8');
    }
  }
  logs.push('✔ Renamed Java package folder');

  if (manifestUpdated.changedPackage) {
    logs.push('✔ Updated AndroidManifest.xml');
  }

  const iosDir = path.join(rootDir, 'ios');
  const infoPlistPath = await findIosInfoPlist(iosDir);
  const infoPlist = readPlistJson(infoPlistPath);

  infoPlist.CFBundleDisplayName = appName;
  infoPlist.CFBundleIdentifier = '$(PRODUCT_BUNDLE_IDENTIFIER)';

  const urlTypesRaw = infoPlist.CFBundleURLTypes;
  const urlTypes = Array.isArray(urlTypesRaw)
    ? (urlTypesRaw as Array<Record<string, unknown>>)
    : (urlTypesRaw ? [urlTypesRaw as Record<string, unknown>] : []);

  let iosSchemeUpdated = false;
  for (const urlType of urlTypes) {
    const schemesRaw = urlType.CFBundleURLSchemes;
    if (!Array.isArray(schemesRaw)) continue;

    for (let i = 0; i < schemesRaw.length; i += 1) {
      if (schemesRaw[i] === existingConfig.app.scheme && existingConfig.app.scheme !== scheme) {
        schemesRaw[i] = scheme;
        iosSchemeUpdated = true;
      }
    }
  }

  const hasNewScheme = urlTypes.some((urlType) => {
    const schemesRaw = urlType.CFBundleURLSchemes;
    return Array.isArray(schemesRaw) && schemesRaw.includes(scheme);
  });

  if (!hasNewScheme) {
    urlTypes.push({
      CFBundleTypeRole: 'Editor',
      CFBundleURLName: nextConfig.app.slug,
      CFBundleURLSchemes: [scheme],
    });
    infoPlist.CFBundleURLTypes = urlTypes;
    iosSchemeUpdated = true;
  }

  writePlistJson(infoPlistPath, infoPlist);

  const appConfigPath = path.join(iosDir, 'AppConfig.xcconfig');
  const appConfigCurrent = (await fs.pathExists(appConfigPath)) ? await fs.readFile(appConfigPath, 'utf8') : '';
  let appConfigNext = upsertXcconfigLine(appConfigCurrent, 'PRODUCT_BUNDLE_IDENTIFIER', appId);
  appConfigNext = upsertXcconfigLine(appConfigNext, 'APP_DISPLAY_NAME', appName);
  if (appConfigNext !== appConfigCurrent) {
    await fs.writeFile(appConfigPath, appConfigNext, 'utf8');
  }

  const pbxprojPath = await findXcodeProjectFile(iosDir);
  const pbxprojContent = await fs.readFile(pbxprojPath, 'utf8');
  const pbxprojUpdated = updatePbxprojBundleId(pbxprojContent, appId);
  if (pbxprojUpdated.changed) {
    await fs.writeFile(pbxprojPath, pbxprojUpdated.content, 'utf8');
  }

  logs.push('✔ Updated iOS bundle identifier');
  logs.push('✔ Updated display name');

  if (manifestUpdated.changedScheme || iosSchemeUpdated) {
    logs.push('✔ Updated deep link scheme');
  }

  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath) as {
    name?: string;
    scripts?: Record<string, string>;
  };

  packageJson.name = packageJsonName;
  packageJson.scripts = packageJson.scripts ?? {};
  packageJson.scripts.configure = 'ts-node scripts/configure-app.ts';

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  const packageJsonWritten = await fs.readFile(packageJsonPath, 'utf8');
  if (!packageJsonWritten.endsWith('\n')) {
    await fs.writeFile(packageJsonPath, `${packageJsonWritten}\n`, 'utf8');
  }

  logs.push('✔ Updated package.json');
  logs.push('✔ Configuration complete');

  for (const line of logs) {
    console.log(line);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`✖ ${message}`);
  process.exit(1);
});
