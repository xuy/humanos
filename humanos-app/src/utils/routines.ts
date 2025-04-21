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
          return JSON.parse(cachedRoutines);
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
    
    try {
      // Try to fetch the data
      const response = await fetch(jsonUrl);
      const data: RoutinesData = await response.json();
      
      // Cache the routines
      if (data.routines) {
        await AsyncStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(data.routines));
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_FETCH_DATE, currentDate);
        return data.routines;
      }
      throw new Error('No routines found in response');
    } catch (fetchError) {
      console.warn('Failed to fetch remote routines, using local data:', fetchError);
      // Use local default routines
      const defaultRoutines = DEFAULT_ROUTINES.routines;
      await AsyncStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(defaultRoutines));
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_FETCH_DATE, currentDate);
      return defaultRoutines;
    }
  } catch (error) {
    console.error('Error in fetchRoutines:', error);
    
    // Fallback to cached data if available
    try {
      const cachedRoutines = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINES);
      if (cachedRoutines) {
        return JSON.parse(cachedRoutines);
      }
    } catch (e) {
      console.warn('Error using cached routines:', e);
    }
    
    // If no cached data, use default routines
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
    const migratedStatuses: Record<string, { status: RoutineStatus; lastUpdated: string }> = {};

    // Migrate each status to the new format
    Object.entries(statuses).forEach(([routineId, value]) => {
      if (typeof value === 'string') {
        // Old format: just a status string
        migratedStatuses[routineId] = {
          status: value as RoutineStatus,
          lastUpdated: new Date().toISOString()
        };
      } else if (value && typeof value === 'object' && 'status' in value) {
        // Already in new format
        migratedStatuses[routineId] = value as { status: RoutineStatus; lastUpdated: string };
      }
    });

    // Save migrated data
    await AsyncStorage.setItem(STORAGE_KEYS.ROUTINE_STATUS, JSON.stringify(migratedStatuses));
  } catch (error) {
    console.error('Error migrating status data:', error);
  }
};

// Get routines for today
export const getTodayRoutines = async (): Promise<RoutineWithStatus[]> => {
  try {
    // Ensure status data is migrated
    await migrateStatusData();

    const routines = await fetchRoutines();
    const currentDay = format(new Date(), 'EEEE');
    
    // Get saved routine statuses
    const statusesJson = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINE_STATUS);
    const statuses: Record<string, { status: RoutineStatus; lastUpdated: string }> = statusesJson ? JSON.parse(statusesJson) : {};
    
    // Filter routines for today
    const todayRoutines = routines.filter(routine => {
      return routine.trigger.days.includes(currentDay);
    });
    
    // Add status to each routine
    return todayRoutines.map(routine => ({
      ...routine,
      status: statuses[routine.id]?.status || 'not_started'
    }));
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

    const statusesJson = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINE_STATUS);
    const statuses: Record<string, { status: RoutineStatus; lastUpdated: string }> = statusesJson ? JSON.parse(statusesJson) : {};
    
    statuses[routineId] = {
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
      await AsyncStorage.setItem(STORAGE_KEYS.ROUTINE_STATUS, JSON.stringify({}));
      await AsyncStorage.setItem('humanos_last_reset_date', currentDate);
    }
  } catch (error) {
    console.error('Error resetting routine statuses:', error);
  }
};