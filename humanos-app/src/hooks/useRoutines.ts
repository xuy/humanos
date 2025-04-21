import { useEffect, useState } from 'react';
import { Routine, RoutineStatus, RoutineWithStatus } from '../types';
import { 
  fetchRoutines, 
  getTodayRoutines, 
  updateRoutineStatus, 
  resetRoutineStatuses
} from '../utils/routines';

export const useRoutines = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayRoutines, setTodayRoutines] = useState<RoutineWithStatus[]>([]);
  const [allRoutines, setAllRoutines] = useState<Routine[]>([]);

  const loadRoutines = async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Reset routine statuses if needed (e.g., new day)
      await resetRoutineStatuses();
      
      // Load today's routines
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
  };

  // Update a routine's status
  const updateStatus = async (routineId: string, status: RoutineStatus) => {
    try {
      await updateRoutineStatus(routineId, status);
      
      // Update the local state
      setTodayRoutines(prev => 
        prev.map(routine => 
          routine.id === routineId 
            ? { ...routine, status } 
            : routine
        )
      );
    } catch (err) {
      console.error('Error updating routine status:', err);
    }
  };

  // Initial load
  useEffect(() => {
    loadRoutines();
  }, []);

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