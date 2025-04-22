import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isWithinInterval, parse } from 'date-fns';
import { Routine, RoutineStatus, RoutinesData, RoutineWithStatus } from '../types';
import DEFAULT_ROUTINES from '../data/defaultRoutines';

const STORAGE_KEYS = {
  ROUTINES: 'humanos_routines',
  JSON_URL: 'humanos_json_url',
  ROUTINE_STATUS: 'humanos_routine_status',
  LAST_FETCH_DATE: 'humanos_last_fetch_date',
};

// Default JSON URL - should be configurable in settings
const DEFAULT_JSON_URL = 'https://raw.githubusercontent.com/xuy/humanos/refs/heads/master/routines.json';

// Fetch routines from remote URL
export const fetchRoutines = async (forceRefresh = false): Promise<Routine[]> => {
  try {
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const lastFetchDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_FETCH_DATE);
    
    // Check if we need to fetch new data
    if (!forceRefresh && lastFetchDate === currentDate) {
      const cachedRoutines = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINES);
      if (cachedRoutines) {
        try {
          const parsedRoutines = JSON.parse(cachedRoutines);
          console.log('fetchRoutines - timeOfDay values from cache:', 
            parsedRoutines.map((r: Routine) => ({ id: r.id, timeOfDay: r.timeOfDay })));
          return parsedRoutines;
        } catch (e) {
          console.warn('Error parsing cached routines:', e);
        }
      }
    }
    
    // Get configured JSON URL or use default
    let jsonUrl = await AsyncStorage.getItem(STORAGE_KEYS.JSON_URL);
    if (!jsonUrl) {
      jsonUrl = DEFAULT_JSON_URL;
      await AsyncStorage.setItem(STORAGE_KEYS.JSON_URL, DEFAULT_JSON_URL);
    }
    
    console.log('fetchRoutines - using URL:', jsonUrl);
    
    try {
      // Try to fetch the data
      const response = await fetch(jsonUrl);
      console.log('fetchRoutines - response status:', response.status);
      const data: RoutinesData = await response.json();
      console.log('fetchRoutines - remote data:', data);
      
      // Cache the routines
      if (data.routines) {
        await AsyncStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(data.routines));
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_FETCH_DATE, currentDate);
        console.log('fetchRoutines - timeOfDay values from remote:', 
          data.routines.map((r: Routine) => ({ id: r.id, timeOfDay: r.timeOfDay })));
        return data.routines;
      }
      throw new Error('No routines found in response');
    } catch (fetchError) {
      console.warn('Failed to fetch remote routines, using local data:', fetchError);
      // Use local default routines
      const defaultRoutines = DEFAULT_ROUTINES.routines;
      await AsyncStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(defaultRoutines));
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_FETCH_DATE, currentDate);
      console.log('fetchRoutines - timeOfDay values from default:', 
        defaultRoutines.map((r: Routine) => ({ id: r.id, timeOfDay: r.timeOfDay })));
      return defaultRoutines;
    }
  } catch (error) {
    console.error('Error in fetchRoutines:', error);
    
    // Fallback to cached data if available
    try {
      const cachedRoutines = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINES);
      if (cachedRoutines) {
        const parsedRoutines = JSON.parse(cachedRoutines);
        console.log('fetchRoutines - timeOfDay values from cache:', 
          parsedRoutines.map((r: Routine) => ({ id: r.id, timeOfDay: r.timeOfDay })));
        return parsedRoutines;
      }
    } catch (e) {
      console.warn('Error using cached routines:', e);
    }
    
    // If no cached data, use default routines
    console.log('fetchRoutines - timeOfDay values from fallback default:', 
      DEFAULT_ROUTINES.routines.map((r: Routine) => ({ id: r.id, timeOfDay: r.timeOfDay })));
    return DEFAULT_ROUTINES.routines;
  }
};

// Get the JSON URL
export const getJsonUrl = async (): Promise<string> => {
  try {
    const url = await AsyncStorage.getItem(STORAGE_KEYS.JSON_URL);
    return url || DEFAULT_JSON_URL;
  } catch (error) {
    return DEFAULT_JSON_URL;
  }
};

// Set the JSON URL
export const setJsonUrl = async (url: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.JSON_URL, url);
  } catch (error) {
    console.error('Error saving JSON URL:', error);
  }
};

// Migrate status data to new format
const migrateStatusData = async (): Promise<void> => {
  try {
    const statusesJson = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINE_STATUS);
    if (!statusesJson) return;

    const statuses = JSON.parse(statusesJson);
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const migratedStatuses: Record<string, Record<string, { status: RoutineStatus; lastUpdated: string }>> = {};

    // Migrate each status to the new format
    Object.entries(statuses).forEach(([routineId, value]) => {
      if (typeof value === 'string') {
        // Old format: just a status string
        if (!migratedStatuses[currentDate]) {
          migratedStatuses[currentDate] = {};
        }
        migratedStatuses[currentDate][routineId] = {
          status: value as RoutineStatus,
          lastUpdated: new Date().toISOString()
        };
      } else if (value && typeof value === 'object') {
        if ('status' in value) {
          // Already in new format but without date
          if (!migratedStatuses[currentDate]) {
            migratedStatuses[currentDate] = {};
          }
          migratedStatuses[currentDate][routineId] = value as { status: RoutineStatus; lastUpdated: string };
        } else {
          // Already in new format with date
          Object.entries(value).forEach(([date, statusData]) => {
            if (!migratedStatuses[date]) {
              migratedStatuses[date] = {};
            }
            migratedStatuses[date][routineId] = statusData as { status: RoutineStatus; lastUpdated: string };
          });
        }
      }
    });

    // Save migrated data
    await AsyncStorage.setItem(STORAGE_KEYS.ROUTINE_STATUS, JSON.stringify(migratedStatuses));
  } catch (error) {
    console.error('Error migrating status data:', error);
  }
};

// Initialize status for all routines
const initializeRoutineStatuses = async (routines: Routine[]): Promise<void> => {
  try {
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const statusesJson = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINE_STATUS);
    const statuses: Record<string, Record<string, { status: RoutineStatus; lastUpdated: string }>> = statusesJson ? JSON.parse(statusesJson) : {};

    // Ensure we have a status entry for today
    if (!statuses[currentDate]) {
      statuses[currentDate] = {};
    }

    // Ensure each routine has a status entry for today
    routines.forEach(routine => {
      if (!statuses[currentDate][routine.id]) {
        statuses[currentDate][routine.id] = {
          status: 'not_started',
          lastUpdated: new Date().toISOString()
        };
      }
    });

    await AsyncStorage.setItem(STORAGE_KEYS.ROUTINE_STATUS, JSON.stringify(statuses));
  } catch (error) {
    console.error('Error initializing routine statuses:', error);
  }
};

// Get routines for today
export const getTodayRoutines = async (): Promise<RoutineWithStatus[]> => {
  try {
    // Ensure status data is migrated
    await migrateStatusData();

    const routines = await fetchRoutines();
    const currentDay = format(new Date(), 'EEEE');
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    
    console.log('getTodayRoutines - currentDay:', currentDay);
    console.log('getTodayRoutines - currentDate:', currentDate);
    console.log('getTodayRoutines - all routines:', routines);
    
    // Initialize statuses for all routines
    await initializeRoutineStatuses(routines);
    
    // Get saved routine statuses
    const statusesJson = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINE_STATUS);
    const statuses: Record<string, Record<string, { status: RoutineStatus; lastUpdated: string }>> = statusesJson ? JSON.parse(statusesJson) : {};
    
    console.log('getTodayRoutines - statuses:', statuses);
    
    // Filter routines for today
    const todayRoutines = routines.filter(routine => {
      const isToday = routine.trigger.days.includes(currentDay);
      console.log(`getTodayRoutines - routine ${routine.id} is today:`, isToday);
      return isToday;
    });
    
    console.log('getTodayRoutines - todayRoutines:', todayRoutines);
    
    // Add status to each routine
    const routinesWithStatus = todayRoutines.map(routine => ({
      ...routine,
      status: statuses[currentDate]?.[routine.id]?.status || 'not_started'
    }));
    
    console.log('getTodayRoutines - routinesWithStatus:', routinesWithStatus);
    console.log('getTodayRoutines - timeOfDay values:', 
      routinesWithStatus.map(r => ({ id: r.id, timeOfDay: r.timeOfDay })));
    
    return routinesWithStatus;
  } catch (error) {
    console.error('Error getting today routines:', error);
    return [];
  }
};

// Check if a routine is currently active based on time window
export const isRoutineActive = (routine: Routine): boolean => {
  const now = new Date();
  const currentTime = format(now, 'HH:mm');
  
  try {
    const startTime = parse(routine.trigger.start, 'HH:mm', new Date());
    const endTime = parse(routine.trigger.end, 'HH:mm', new Date());
    
    // Set hours and minutes on today's date for comparison
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    
    startDate.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
    endDate.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
    
    return isWithinInterval(now, { start: startDate, end: endDate });
  } catch (error) {
    console.error('Error checking if routine is active:', error);
    return false;
  }
};

// Update a routine's status
export const updateRoutineStatus = async (routineId: string, status: RoutineStatus): Promise<void> => {
  try {
    // Ensure status data is migrated
    await migrateStatusData();

    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const statusesJson = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINE_STATUS);
    const statuses: Record<string, Record<string, { status: RoutineStatus; lastUpdated: string }>> = statusesJson ? JSON.parse(statusesJson) : {};
    
    if (!statuses[currentDate]) {
      statuses[currentDate] = {};
    }
    
    statuses[currentDate][routineId] = {
      status,
      lastUpdated: new Date().toISOString()
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.ROUTINE_STATUS, JSON.stringify(statuses));
  } catch (error) {
    console.error('Error updating routine status:', error);
  }
};

// Reset all routine statuses (to be called at midnight or app startup)
export const resetRoutineStatuses = async (): Promise<void> => {
  try {
    const lastResetDate = await AsyncStorage.getItem('humanos_last_reset_date');
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    
    if (lastResetDate !== currentDate) {
      const routines = await fetchRoutines();
      await initializeRoutineStatuses(routines);
      await AsyncStorage.setItem('humanos_last_reset_date', currentDate);
    }
  } catch (error) {
    console.error('Error resetting routine statuses:', error);
  }
};

// Check if a routine is the next one to be completed
export const isNextUp = (routine: Routine, currentTime: Date = new Date()): boolean => {
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinutes;

  try {
    const [preferredHour, preferredMinutes] = routine.trigger.preferred.split(':').map(Number);
    const preferredTimeInMinutes = preferredHour * 60 + preferredMinutes;

    // Only consider routines that haven't started yet
    if (currentTimeInMinutes >= preferredTimeInMinutes) {
      return false;
    }

    // Get all routines for today
    const currentDay = format(currentTime, 'EEEE');
    if (!routine.trigger.days.includes(currentDay)) {
      return false;
    }

    // This is a simple implementation - in a real app, you might want to
    // compare with other routines to find the actual next one
    return true;
  } catch (error) {
    console.error('Error checking if routine is next up:', error);
    return false;
  }
};