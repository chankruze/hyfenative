# FCM

## Current Status

Firebase Cloud Messaging is **not integrated** in this boilerplate yet.

No Firebase messaging dependency or native configuration is currently present.

## What Exists Today

- No `@react-native-firebase/messaging` dependency.
- No Firebase app config files in repo (`google-services.json`, `GoogleService-Info.plist`).
- No notification permission/request/token lifecycle module in `src/`.
- No push token registration API endpoint module.

## Recommended Integration Shape

### 1. Dependency and Native Setup

- Add Firebase messaging package and platform setup per official docs.
- Add required native config files:
  - Android: `android/app/google-services.json`
  - iOS: `ios/<AppName>/GoogleService-Info.plist`
- Apply required Gradle and Xcode changes.

### 2. App Layer Module

Create `src/notifications/fcm.ts` with responsibilities:

- request notification permission
- read FCM token
- handle token refresh
- expose foreground/background handlers

Keep this isolated from UI screens.

### 3. API Contract

Create endpoint module `src/api/endpoints/notifications/`:

- schema-validated payload for token registration
- methods to register/unregister push token

### 4. Store Integration

If token persistence is needed, add a dedicated store (or extend auth store) with:

- current token
- last sync timestamp
- sync state

Register resetter if it must be cleared on logout or global reset.

### 5. Initialization Point

Initialize notification lifecycle in app startup (typically near `index.js` / root bootstrap) to avoid duplicate listeners.

## Safety Rules

- Do not hardcode FCM server keys in app code.
- Treat push token as sensitive identifier.
- Keep all payload contracts Zod-validated before API submission.
- Gate behavior by auth state if token is user-scoped.
