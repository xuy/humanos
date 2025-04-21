import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import useRoutines from '../hooks/useRoutines';

type DayColumn = {
  day: string;
  shortDay: string;
};

const days: DayColumn[] = [
  { day: 'Monday', shortDay: 'Mon' },
  { day: 'Tuesday', shortDay: 'Tue' },
  { day: 'Wednesday', shortDay: 'Wed' },
  { day: 'Thursday', shortDay: 'Thu' },
  { day: 'Friday', shortDay: 'Fri' },
  { day: 'Saturday', shortDay: 'Sat' },
  { day: 'Sunday', shortDay: 'Sun' },
];

const WeeklyView: React.FC = () => {
  const { isLoading, allRoutines, refreshRoutines } = useRoutines();

  // Group routines by day
  const getRoutinesByDay = (day: string) => {
    return allRoutines.filter(routine => 
      routine.trigger.days.includes(day)
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Schedule</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.weekContainer}>
          {days.map(({ day, shortDay }) => {
            const routinesForDay = getRoutinesByDay(day);
            
            return (
              <View key={day} style={styles.dayColumn}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayText}>{shortDay}</Text>
                </View>
                
                <View style={styles.dayContent}>
                  {routinesForDay.length > 0 ? (
                    routinesForDay.map(routine => (
                      <View key={routine.id} style={styles.routineItem}>
                        <Text style={styles.routineName} numberOfLines={1}>
                          {routine.name}
                        </Text>
                        <Text style={styles.routineTime}>
                          {routine.trigger.start}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noRoutinesText}>No routines</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={refreshRoutines}
      >
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekContainer: {
    flexDirection: 'row',
    paddingBottom: 16,
  },
  dayColumn: {
    width: 140,
    marginHorizontal: 4,
  },
  dayHeader: {
    backgroundColor: '#E0E0E0',
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dayContent: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 8,
    minHeight: 200,
  },
  routineItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    padding: 8,
    marginVertical: 4,
  },
  routineName: {
    fontSize: 14,
    fontWeight: '500',
  },
  routineTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  noRoutinesText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    margin: 16,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WeeklyView;