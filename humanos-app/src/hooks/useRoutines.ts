import { useEffect, useState, useCallback } from 'react';
import { Routine, RoutineStatus, RoutineWithStatus } from '../types';
import { 
  fetchRoutines, 
  getTodayRoutines, 
  updateRoutineStatus,
} from '../utils/routines';

export const useRoutines = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayRoutines, setTodayRoutines] = useState<RoutineWithStatus[]>([]);
  const [allRoutines, setAllRoutines] = useState<Routine[]>([]);

  const loadRoutines = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load today's routines first
      const routinesForToday = await getTodayRoutines();
      setTodayRoutines(routinesForToday);
      
      // Load all routines for weekly view
      const all = await fetchRoutines(forceRefresh);
      setAllRoutines(all);
    } catch (err) {
      setError('Failed to load routines. Please try again.');
      console.error('Error in useRoutines hook:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update a routine's status
  const updateStatus = useCallback(async (routineId: string, status: RoutineStatus) => {
    try {
      await updateRoutineStatus(routineId, status);
      // Reload routines to ensure consistency
      await loadRoutines(true);
    } catch (err) {
      console.error('Error updating routine status:', err);
    }
  }, [loadRoutines]);

  // Initial load
  useEffect(() => {
    loadRoutines();
  }, [loadRoutines]);

  return {
    isLoading,
    error,
    todayRoutines,
    allRoutines,
    refreshRoutines: () => loadRoutines(true),
    updateRoutineStatus: updateStatus,
  };
};

export default useRoutines;