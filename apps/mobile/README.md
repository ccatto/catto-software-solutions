# Catto App Template - Mobile

Capacitor wrapper for shipping your app to iOS and Android.

## Quick Start

```bash
# Build the mobile app (frontend + sync)
yarn build

# Open iOS in Xcode
yarn ios:open

# Run on iOS simulator
yarn ios:run
```

## Commands

| Command               | Description                                        |
| --------------------- | -------------------------------------------------- |
| `yarn build`          | Build frontend + copy to www + sync with Capacitor |
| `yarn build:frontend` | Build Next.js with mobile config (static export)   |
| `yarn copy:frontend`  | Copy frontend build to www directory               |
| `yarn sync`           | Sync Capacitor with native projects                |
| `yarn ios:open`       | Open iOS project in Xcode                          |
| `yarn ios:run`        | Run on iOS simulator                               |

## Directory Structure

```
mobile/
├── capacitor.config.ts   # Capacitor configuration
├── package.json          # Mobile dependencies
├── tsconfig.json         # TypeScript config
├── www/                  # Next.js static build (generated, gitignored)
└── ios/                  # Native iOS project (generated)
```

## How It Works

1. **Build**: Next.js builds using `next.config.mobile.ts` (static export)
2. **Copy**: Static files copied from `../frontend/out/` to `www/`
3. **Sync**: Capacitor syncs `www/` into native iOS project
4. **Run**: iOS app loads the static site in a WebView

## Configuration

### App Details

- **App ID**: `com.example.myapp` (update in `capacitor.config.ts`)
- **App Name**: `MyApp` (update in `capacitor.config.ts`)
- **Scheme**: `MyApp` (update in `capacitor.config.ts`)

### Capacitor Plugins

- `@capacitor/app` - App state and info
- `@capacitor/haptics` - Haptic feedback
- `@capacitor/keyboard` - Keyboard events
- `@capacitor/network` - Network status
- `@capacitor/preferences` - Secure storage (for JWT tokens)
- `@capacitor/push-notifications` - Push notifications
- `@capacitor/share` - Native share dialog
- `@capacitor/splash-screen` - Launch screen
- `@capacitor/status-bar` - Status bar styling

## Development Notes

- **Web dev**: Use `yarn dev:frontend` from root (uses standard Next.js config)
- **Mobile testing**: Build mobile (`yarn build`) then run in Xcode
- **Debugging**: Use Safari Developer Tools with iOS Simulator

## Next Steps

1. Update `capacitor.config.ts` with your app ID and name
2. Add app icons and splash screens to `assets/`
3. Run `npx cap add ios` to initialize the iOS project
4. Test on physical iOS device
5. Submit to Apple App Store
