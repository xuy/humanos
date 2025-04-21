import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppNavigator from './src/navigation/AppNavigator';

// Default sample data for first run
const DEFAULT_ROUTINES = {
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
        { "text": "Hair refresh routine" }
      ]
    }
  ]
};

export default function App() {
  // Initialize app data on first run
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if this is the first run
        const hasRunBefore = await AsyncStorage.getItem('humanos_initialized');
        
        if (!hasRunBefore) {
          // Set default JSON URL
          await AsyncStorage.setItem('humanos_json_url', 'https://raw.githubusercontent.com/username/humanos/main/routines.json');
          
          // Initialize with sample data
          await AsyncStorage.setItem('humanos_routines', JSON.stringify(DEFAULT_ROUTINES));
          
          // Mark as initialized
          await AsyncStorage.setItem('humanos_initialized', 'true');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    
    initializeApp();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}