import { RoutinesData } from '../types';

const DEFAULT_ROUTINES: RoutinesData = {
  "routines": [
    {
      "id": "wake_flow",
      "name": "Morning Wake Flow",
      "tags": ["morning", "wake"],
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
    }
  ]
};

export default DEFAULT_ROUTINES; 