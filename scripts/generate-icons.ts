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

const IOS_SIZES = [20, 29, 40, 60, 76, 83.5, 1024];

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

    await sharp(iconPath)
      .resize(size, size)
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'));
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

  for (const size of IOS_SIZES) {
    const scales = size === 1024 ? [1] : [2, 3];

    for (const scale of scales) {
      const pixelSize = Math.round(size * scale);
      const filename = `icon-${size}@${scale}x.png`;

      await sharp(iconPath)
        .resize(pixelSize, pixelSize)
        .png()
        .toFile(path.join(appIconSetPath, filename));

      contentsJson.images.push({
        size: `${size}x${size}`,
        idiom: 'iphone',
        filename,
        scale: `${scale}x`,
      });
    }
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
