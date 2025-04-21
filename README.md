# Human OS

A minimalist habit memory app that guides the user through multi-step routines (like skincare, hydration, wake-up rituals), until they become second nature.

## Features

- Daily dashboard showing routines for the current day
- Step-by-step routine guide with tap-to-progress navigation
- Weekly schedule view to see all routines at a glance
- Custom JSON-based routine definitions
- Local caching for offline use
- Developer mode for advanced users

## Tech Stack

- React Native (with Expo)
- TypeScript
- AsyncStorage for local data
- React Navigation for navigation
- date-fns for date/time operations

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS development)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/humanos.git
   cd humanos
   ```

2. Install dependencies:
   ```
   cd humanos-app
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Run on a device or emulator:
   ```
   npm run android
   # or
   npm run ios
   ```

## Customizing Routines

The app loads routines from a JSON file. You can modify the `routines.json` file in the repository to customize your routines.

Structure:
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
        { "text": "Step description", "intention": "Optional intention", "duration": 5 }
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