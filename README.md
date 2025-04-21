# Human OS

A minimalist habit memory app that guides users through multi-step routines (like skincare, hydration, wake-up rituals).

## Features

- Daily dashboard showing routines for the current day
- Step-by-step routine guide with tap-to-progress navigation
- Weekly schedule view to see all routines at a glance
- Custom JSON-based routine definitions
- Local caching for offline use
- Developer mode for advanced users

## Tech Stack

- React Native (Expo)
- TypeScript
- AsyncStorage for local data
- React Navigation
- date-fns

## Development Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Windows/WSL Setup

1. Install WSL and Ubuntu:
   ```powershell
   wsl --install -d Ubuntu
   ```

2. Clone and setup:
   ```bash
   git clone https://github.com/xuy/humanos.git
   cd humanos
   cd humanos-app
   npm install
   ```

3. Configure Metro access:
   ```bash
   # From WSL
   ./run-setup.sh
   ```
   This script:
   - Sets up port forwarding from Windows to WSL
   - Configures Windows Firewall for Expo ports
   - Enables access from Android devices on the same network

4. Start development:
   ```bash
   npm start
   ```

### Running the App

1. Start the Metro bundler:
   ```bash
   npm start
   ```

2. Run on device:
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   ```

3. For Android devices:
   - Install Expo Go
   - Connect to same network as your PC
   - Scan QR code or enter URL shown in terminal

## Customizing Routines

Routines are defined in JSON format. Example:
```json
{
  "routines": [
    {
      "id": "unique_id",
      "name": "Routine Name",
      "tags": ["tag1", "tag2"],
      "trigger": {
        "type": "time_window",
        "start": "HH:MM",
        "end": "HH:MM",
        "preferred": "HH:MM",
        "days": ["Monday", "Tuesday", ...]
      },
      "steps": [
        { "text": "Step description", "intention": "Optional", "duration": 5 }
      ]
    }
  ]
}
```

## Deployment

1. Build the app:
   ```
   expo build:android
   # or
   expo build:ios
   ```

2. Host the `routines.json` file on a publicly accessible URL (GitHub Pages, Vercel, etc.)

3. In the app settings, update the JSON URL to point to your hosted file

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Features

- Voice prompts
- Internal timers
- Routine editing within the app
- Cross-device sync
- Streaks and analytics