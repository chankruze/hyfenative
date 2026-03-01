import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { config } from '../hyfenative.config';

const ANDROID_SIZES: Record<string, number> = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};

const IOS_SIZES = [20, 29, 40, 60, 1024];

async function main() {
  const root = process.cwd();
  const iconPath = path.join(root, config.assets.icon);

  if (!(await fs.pathExists(iconPath))) {
    throw new Error(`Icon not found at ${iconPath}`);
  }

  console.log('Generating Android icons...');

  const androidRes = path.join(root, 'android/app/src/main/res');

  for (const [density, size] of Object.entries(ANDROID_SIZES)) {
    const dir = path.join(androidRes, `mipmap-${density}`);
    await fs.ensureDir(dir);

    // App manifest references both launcher and round icons.
    await sharp(iconPath)
      .resize(size, size)
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'));

    await sharp(iconPath)
      .resize(size, size)
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'));
  }

  console.log('✔ Android icons generated');

  console.log('Generating iOS icons...');

  const iosDir = path.join(root, 'ios');
  const entries = await fs.readdir(iosDir);

  let appIconSetPath: string | null = null;

  for (const entry of entries) {
    if (!entry.endsWith('.xcodeproj')) continue;

    const appName = entry.replace('.xcodeproj', '');
    appIconSetPath = path.join(
      iosDir,
      appName,
      'Images.xcassets/AppIcon.appiconset',
    );

    break;
  }

  if (!appIconSetPath) {
    throw new Error('Could not locate iOS AppIcon set');
  }

  await fs.ensureDir(appIconSetPath);

  const contentsJson: any = {
    images: [],
    info: { version: 1, author: 'xcode' },
  };
  const generatedFilenames = new Set<string>();

  for (const size of IOS_SIZES) {
    const scales = size === 1024 ? [1] : [2, 3];

    for (const scale of scales) {
      const pixelSize = Math.round(size * scale);
      const filename =
        size === 1024 ? 'icon-1024.png' : `icon-${size}@${scale}x.png`;
      generatedFilenames.add(filename);

      await sharp(iconPath)
        .resize(pixelSize, pixelSize)
        .png()
        .toFile(path.join(appIconSetPath, filename));

      contentsJson.images.push(
        size === 1024
          ? {
              size: `${size}x${size}`,
              idiom: 'ios-marketing',
              filename,
              scale: `${scale}x`,
            }
          : {
              size: `${size}x${size}`,
              idiom: 'iphone',
              filename,
              scale: `${scale}x`,
            },
      );
    }
  }

  const existingIosIcons = await fs.readdir(appIconSetPath);
  for (const file of existingIosIcons) {
    if (!/^icon-.*\.png$/.test(file)) continue;
    if (generatedFilenames.has(file)) continue;
    await fs.remove(path.join(appIconSetPath, file));
  }

  await fs.writeJson(path.join(appIconSetPath, 'Contents.json'), contentsJson, {
    spaces: 2,
  });

  console.log('✔ iOS icons generated');
  console.log('✔ Icon generation complete');
}

main().catch(err => {
  console.error('✖', err.message);
  process.exit(1);
});
