 Human OS – App Spec v1.0
A minimalist habit memory app that guides the user through multi-step routines (like skincare, hydration, wake-up rituals), until they become second nature. JSON-based. No fluff.

🧭 Summary

Feature	Description
Platforms	Android (target first), iOS (optional/second)
App Type	Mobile (built with React Native)
Data Source	Hosted routines.json file loaded on launch
Local Caching	Yes – stores the most recent routines offline
Primary Views	Daily routines list, Routine runner, Weekly schedule
UI Philosophy	Minimalist, tap-to-progress, no distracting elements
Sync	Manual update via “Refresh” button that pulls hosted file
Developer Mode	Optional raw JSON viewer / editor for advanced users
🧱 Tech Stack

Component	Tooling
UI Framework	React Native (Expo for faster dev)
Storage	AsyncStorage (React Native)
HTTP Client	fetch API
JSON Hosting	GitHub Pages / Dropbox / Vercel static URL
Date/Time	dayjs or date-fns
Optional	expo-speech for voice-based future feature
📂 routines.json Structure
Here’s the live schema expected at the hosted URL (e.g. https://yourdomain.com/routines.json)

json
Copy
Edit
{
  "routines": [
    {
      "id": "wake_flow",
      "name": "Morning Wake Flow",
      "tags": ["morning", "wake"],
      "trigger": {
        "type": "time_window",
        "start": "05:30",
        "end": "08:30",
        "preferred": "06:30",
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      },
      "steps": [
        { "text": "Open blinds or go outside", "intention": "Sunlight to reset rhythm" },
        { "text": "Hydrate with 32oz electrolyte water", "duration": 2 },
        { "text": "Brush teeth and wash face" },
        { "text": "Stretch or light walk (5–10 min)", "duration": 5 }
      ]
    },
    {
      "id": "hydration_protocol",
      "name": "Hydration OS",
      "tags": ["daily", "hydration"],
      "trigger": {
        "type": "time_window",
        "start": "07:00",
        "end": "10:00",
        "preferred": "08:00",
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      },
      "steps": [
        { "text": "Prepare 32oz water bottle" },
        { "text": "Add 1/4 tsp Light Salt + lemon juice" },
        { "text": "Drink gradually throughout the morning" }
      ]
    },
    {
      "id": "sunday_shower",
      "name": "Full Shower Ritual",
      "tags": ["shower", "weekly"],
      "trigger": {
        "type": "time_window",
        "start": "08:00",
        "end": "11:00",
        "preferred": "09:00",
        "days": ["Sunday"]
      },
      "steps": [
        { "text": "Shampoo + Conditioner" },
        { "text": "Exfoliate (BHA/Naturium)" },
        { "text": "Full body wash and moisturize" },
        { "text": "Hair refresh routine (see 'hair_refresh')" }
      ]
    }
  ]
}
🖼 App Views
1. Daily Dashboard
Shows active routines for the current day, based on day-of-week + current time

UI:

Routine cards with title + optional icon

Status: Not Started / In Progress / Done

Manual start or auto-suggest (e.g., "Ready to begin Wake Flow?")

2. Routine Runner
Full-screen guided mode with:

Step-by-step navigation (tap to next step)

Optional intention or timer display

"Complete routine" at end

3. Weekly View (Optional)
Grid showing which routines are scheduled for which days

4. Settings / Developer Mode
URL for routines JSON

"Refresh Routines" (re-pull JSON and cache)

Option to view raw JSON

(Later) Import/Export JSON

🔄 Data Flow
text
Copy
Edit
On App Launch:
    ↓
Fetch routines.json from stored URL
    ↓
Parse + cache in AsyncStorage
    ↓
Filter based on:
    - Current time window
    - Day of week
    ↓
Render today's routines
📌 Feature Flags (v1.0)

Feature	Included?
Local routine caching	✅ Yes
Hosted JSON URL override	✅ Yes
Time-window triggering	✅ Yes
Day-of-week filtering	✅ Yes
Routine completion state	✅ Yes (resets daily)
Internal timers	⏳ No (later version)
Voice prompts	🔇 No
Analytics or streaks	📊 No
Notifications/reminders	🔔 Optional (later version)
🔜 Future Features (Post-MVP Ideas)
Internalized mode (routine fades after X days of success)

Intentional-mode (1 step per screen + guiding text)

Audio / haptic feedback on step change

Routine editing in-app

Cross-device sync (optional cloud store)

Integrate with calendar or fitness APIs

Would you like me to generate:

A basic React Native project scaffold that pulls this JSON and shows daily routines?

A spec document PDF for sharing with collaborators or AI agents?

A simple design mockup of the main views?

Let me know how you want to begin building — I can walk you through or create the starter files.