# Human OS – App Spec v1.1

A minimalist habit memory app that guides users through multi-step routines until they become second nature.

## Core Features

- **Platforms**: Android, iOS (React Native)
- **Data Source**: Hosted JSON with local fallback
- **Views**: Daily, Weekly, Routine Runner, Settings
- **Sync**: Manual refresh with local caching
- **Developer Mode**: JSON viewer and status inspector

## Data Structure

```json
{
  "routines": [
    {
      "id": "routine_id",
      "name": "Routine Name",
      "tags": ["tag1", "tag2"],
      "trigger": {
        "type": "time_window",
        "start": "HH:mm",
        "end": "HH:mm",
        "preferred": "HH:mm",
        "days": ["Monday", "Tuesday", ...]
      },
      "steps": [
        { 
          "text": "Step description",
          "intention": "Optional intention",
          "duration": "Optional minutes"
        }
      ]
    }
  ]
}
```

## Views

1. **Daily Dashboard**
   - Shows today's routines based on day and time
   - Status indicators: Not Started / In Progress / Completed
   - Tap to start routine

2. **Routine Runner**
   - Full-screen step-by-step guidance
   - Shows intention and duration if available
   - Progress tracking and completion

3. **Weekly View**
   - Grid layout of routines by day
   - Time window visualization

4. **Settings**
   - JSON URL configuration
   - Developer mode with:
     - Raw JSON viewer
     - Status data inspector
     - Refresh controls
   - Clear today's status

## Status Management

- Statuses stored in AsyncStorage
- Format: `{ routineId: { status: string, lastUpdated: string } }`
- Daily reset at midnight
- Manual reset via Settings
- Status migration for backward compatibility

## Data Flow

1. App Launch:
   - Load cached routines
   - Check for status updates
   - Filter for today's routines

2. Routine Updates:
   - Status changes trigger full reload
   - Developer mode shows real-time status
   - Manual refresh available

## Current Implementation

- ✅ Local routine caching
- ✅ JSON URL configuration
- ✅ Time-window triggering
- ✅ Day-of-week filtering
- ✅ Status tracking and reset
- ✅ Developer tools
- ✅ Error handling and fallbacks