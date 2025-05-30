import { RoutinesData } from '../types';

const DEFAULT_ROUTINES: RoutinesData = {
  "routines": [
    {
      "id": "wake_flow",
      "name": "Morning Wake Flow",
      "tags": ["morning", "wake"],
      "emoji": "☀️",
      "timeOfDay": "morning",
      "trigger": {
        "type": "time_window" as const,
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
      "emoji": "💧",
      "timeOfDay": "morning",
      "trigger": {
        "type": "time_window" as const,
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
      "emoji": "🧴",
      "timeOfDay": "morning",
      "trigger": {
        "type": "time_window" as const,
        "start": "08:00",
        "end": "11:00",
        "preferred": "09:00",
        "days": ["Sunday"]
      },
      "steps": [
        { "text": "Shampoo + Conditioner" },
        { "text": "Exfoliate (BHA/Naturium)" },
        { "text": "Full body wash and moisturize" },
        { "text": "Hair refresh routine" }
      ]
    },
    {
      "id": "evening_wind_down",
      "name": "Evening Wind Down",
      "tags": ["evening", "sleep"],
      "emoji": "🌙",
      "timeOfDay": "evening",
      "trigger": {
        "type": "time_window" as const,
        "start": "20:00",
        "end": "22:00",
        "preferred": "21:00",
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      },
      "steps": [
        { "text": "Dim lights and turn on night mode on devices", "intention": "Reduce blue light exposure" },
        { "text": "5-minute stretching or yoga", "duration": 5 },
        { "text": "Brush teeth and wash face" },
        { "text": "10 minutes of reading (non-digital)", "duration": 10 },
        { "text": "Set out clothes for tomorrow" }
      ]
    },
    {
      "id": "workout_session",
      "name": "Workout Protocol",
      "tags": ["fitness", "health"],
      "emoji": "💪",
      "timeOfDay": "afternoon",
      "trigger": {
        "type": "time_window" as const,
        "start": "16:00",
        "end": "19:00",
        "preferred": "17:30",
        "days": ["Monday", "Wednesday", "Friday"]
      },
      "steps": [
        { "text": "5-minute dynamic warmup", "duration": 5 },
        { "text": "Main workout section", "duration": 30 },
        { "text": "5-minute cooldown stretch", "duration": 5 },
        { "text": "Drink 16oz of water", "intention": "Hydration" },
        { "text": "Log workout details (optional)" }
      ]
    }
  ]
};

export default DEFAULT_ROUTINES; 