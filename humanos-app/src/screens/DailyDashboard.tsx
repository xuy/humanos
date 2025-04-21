import React from 'react';
import { 
  ActivityIndicator, 
  FlatList, 
  RefreshControl, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { format } from 'date-fns';
import RoutineCard from '../components/RoutineCard';
import useRoutines from '../hooks/useRoutines';
import { RoutineWithStatus } from '../types';

type DailyDashboardProps = {
  navigation: any;
};

const DailyDashboard: React.FC<DailyDashboardProps> = ({ navigation }) => {
  const { 
    isLoading, 
    error, 
    todayRoutines, 
    refreshRoutines, 
    updateRoutineStatus 
  } = useRoutines();
  
  const currentDate = format(new Date(), 'EEEE, MMMM d');

  const handleRoutinePress = (routine: RoutineWithStatus) => {
    // If routine is not started, mark it as in progress
    if (routine.status === 'not_started') {
      updateRoutineStatus(routine.id, 'in_progress');
    }
    
    // Navigate to routine runner
    navigation.navigate('RoutineRunner', { routine });
  };
  
  // No routines for today
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No routines scheduled for today</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Weekly')}
      >
        <Text style={styles.buttonText}>View Weekly Schedule</Text>
      </TouchableOpacity>
    </View>
  );

  const getStatusPriority = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 0;
      case 'not_started':
        return 1;
      case 'completed':
        return 2;
      default:
        return 3;
    }
  };

  const sortedRoutines = [...todayRoutines].sort((a, b) => {
    return getStatusPriority(a.status) - getStatusPriority(b.status);
  });

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.date}>{currentDate}</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={refreshRoutines}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{currentDate}</Text>
      <Text style={styles.title}>Today's Routines</Text>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={sortedRoutines}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <RoutineCard 
              routine={item} 
              onPress={handleRoutinePress} 
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refreshRoutines}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 16,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DailyDashboard;