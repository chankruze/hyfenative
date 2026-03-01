#!/usr/bin/env bash

set -e

echo "🧹 Starting React Native deep cleanup..."

PROJECT_ROOT="$(pwd)"

echo ""
echo "📦 Project size before cleanup:"
du -sh "$PROJECT_ROOT" | awk '{print $1}'

echo ""
echo "• Stopping Gradle daemons..."
if [ -f "android/gradlew" ]; then
  (cd android && ./gradlew --stop) 2>/dev/null || true
fi

echo ""
echo "• Removing node_modules..."
rm -rf node_modules

echo "• Removing Android build artifacts..."
rm -rf android/app/build
rm -rf android/build
rm -rf android/.gradle

echo "• Running Gradle clean..."
if [ -f "android/gradlew" ]; then
  (cd android && ./gradlew clean) || true
fi

echo "• Removing iOS build artifacts..."
rm -rf ios/build
rm -rf ios/Pods

echo "• Clearing Metro cache..."
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true

echo "• Clearing Watchman..."
watchman watch-del-all 2>/dev/null || true

echo "• Clearing Xcode DerivedData..."
rm -rf ~/Library/Developer/Xcode/DerivedData/* 2>/dev/null || true

# Optional heavy Gradle cleanup
if [ "$1" == "--full-gradle" ]; then
  echo "• Clearing global Gradle cache..."
  rm -rf ~/.gradle/caches 2>/dev/null || true
  rm -rf ~/.gradle/daemon 2>/dev/null || true
  rm -rf ~/.gradle/native 2>/dev/null || true
  rm -rf ~/.gradle/wrapper 2>/dev/null || true
fi

echo ""
echo "📦 Project size after cleanup:"
du -sh "$PROJECT_ROOT" | awk '{print $1}'

echo ""
echo "📦 Reinstalling dependencies with npm..."
npm install

echo "🍏 Reinstalling CocoaPods..."
if [ -d "ios" ]; then
  (cd ios && pod install)
fi

echo ""
echo "✅ Cleanup complete."
