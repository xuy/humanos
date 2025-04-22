import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { format } from 'date-fns';
import { useRoutines } from '../hooks/useRoutines';
import { RoutineWithStatus } from '../types';
import RoutineCard from '../components/RoutineCard';

type DailyDashboardProps = {
  navigation: any;
};

type TimeOfDayGroup = {
  title: string;
  emoji: string;
  routines: RoutineWithStatus[];
};

const TIME_OF_DAY_GROUPS: TimeOfDayGroup[] = [
  { title: 'Morning', emoji: '☀️', routines: [] },
  { title: 'Afternoon', emoji: '🌤️', routines: [] },
  { title: 'Evening', emoji: '🌙', routines: [] }
];

const DailyDashboard: React.FC<DailyDashboardProps> = ({ navigation }) => {
  const { 
    isLoading, 
    error, 
    todayRoutines, 
    refreshRoutines, 
    updateRoutineStatus 
  } = useRoutines();
  
  const [expandedRoutines, setExpandedRoutines] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  
  const currentDate = format(new Date(), 'EEEE, MMMM d');

  // Debug logging
  useEffect(() => {
    console.log('DailyDashboard - isLoading:', isLoading);
    console.log('DailyDashboard - error:', error);
    console.log('DailyDashboard - todayRoutines:', todayRoutines);
  }, [isLoading, error, todayRoutines]);

  const toggleRoutine = (routineId: string) => {
    setExpandedRoutines(prev => {
      const newSet = new Set(prev);
      if (newSet.has(routineId)) {
        newSet.delete(routineId);
      } else {
        newSet.add(routineId);
      }
      return newSet;
    });
  };

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupTitle)) {
        newSet.delete(groupTitle);
      } else {
        newSet.add(groupTitle);
      }
      return newSet;
    });
  };

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

  // Group routines by time of day
  const groupedRoutines = TIME_OF_DAY_GROUPS.map(group => ({
    ...group,
    routines: todayRoutines
      .filter(routine => routine.timeOfDay?.toLowerCase() === group.title.toLowerCase())
      .sort((a, b) => getStatusPriority(a.status) - getStatusPriority(b.status))
  }));

  // Debug logging for grouped routines
  useEffect(() => {
    console.log('DailyDashboard - groupedRoutines:', groupedRoutines);
    console.log('DailyDashboard - todayRoutines timeOfDay values:', 
      todayRoutines.map(r => ({ id: r.id, timeOfDay: r.timeOfDay })));
  }, [groupedRoutines]);

  const renderCollapsedRoutine = (routine: RoutineWithStatus) => (
    <TouchableOpacity
      style={styles.collapsedRoutine}
      onPress={() => toggleRoutine(routine.id)}
    >
      <View style={styles.collapsedRoutineContent}>
        <Text style={styles.collapsedRoutineTitle}>
          {routine.emoji} {routine.name}
        </Text>
        <Text style={styles.collapsedRoutineTime}>
          {routine.trigger.start} - {routine.trigger.end}
        </Text>
      </View>
      <Text style={styles.expandIcon}>▼</Text>
    </TouchableOpacity>
  );

  const renderGroup = ({ item }: { item: TimeOfDayGroup }) => {
    if (item.routines.length === 0) return null;

    const isGroupExpanded = expandedGroups.has(item.title);
    const allCompleted = item.routines.every(r => r.status === 'completed');

    if (!isGroupExpanded && allCompleted) {
      return (
        <TouchableOpacity
          style={styles.collapsedGroup}
          onPress={() => toggleGroup(item.title)}
        >
          <View style={styles.collapsedGroupHeader}>
            <Text style={styles.collapsedGroupTitle}>
              {item.emoji} {item.title} ({item.routines.length} completed)
            </Text>
            <Text style={styles.expandIcon}>▼</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.groupContainer}>
        <TouchableOpacity
          style={styles.groupHeader}
          onPress={() => toggleGroup(item.title)}
        >
          <Text style={styles.groupEmoji}>{item.emoji}</Text>
          <Text style={styles.groupTitle}>{item.title}</Text>
          <Text style={styles.expandIcon}>
            {isGroupExpanded ? '▼' : '▶'}
          </Text>
        </TouchableOpacity>
        {isGroupExpanded && item.routines.map(routine => {
          const isExpanded = expandedRoutines.has(routine.id);
          if (routine.status === 'completed' && !isExpanded) {
            return renderCollapsedRoutine(routine);
          }
          return (
            <RoutineCard 
              key={routine.id}
              routine={routine} 
              onPress={handleRoutinePress} 
            />
          );
        })}
      </View>
    );
  };

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
          data={groupedRoutines}
          keyExtractor={item => item.title}
          renderItem={renderGroup}
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
  groupContainer: {
    marginBottom: 24,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
  },
  groupEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  collapsedRoutine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  collapsedRoutineContent: {
    flex: 1,
  },
  collapsedRoutineTitle: {
    fontSize: 16,
    color: '#666',
  },
  collapsedRoutineTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  collapsedGroup: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
  },
  collapsedGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collapsedGroupTitle: {
    fontSize: 16,
    color: '#666',
  },
  expandIcon: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
});

export default DailyDashboard;