import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RoutineWithStatus } from '../types';
import { isRoutineActive } from '../utils/routines';

type RoutineCardProps = {
  routine: RoutineWithStatus;
  onPress: (routine: RoutineWithStatus) => void;
};

const RoutineCard: React.FC<RoutineCardProps> = ({ routine, onPress }) => {
  const isActive = isRoutineActive(routine);
  
  // Status indicator colors
  const getStatusColor = () => {
    switch (routine.status) {
      case 'completed':
        return '#4CAF50'; // Green
      case 'in_progress':
        return '#2196F3'; // Blue
      case 'not_started':
      default:
        return isActive ? '#FF9800' : '#9E9E9E'; // Orange if active, Gray if not
    }
  };
  
  // Status text
  const getStatusText = () => {
    switch (routine.status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'not_started':
      default:
        return isActive ? 'Ready' : 'Not Started';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: getStatusColor() }]}
      onPress={() => onPress(routine)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{routine.name}</Text>
        <Text style={styles.time}>
          {routine.trigger.start} - {routine.trigger.end}
        </Text>
        <View style={styles.tags}>
          {routine.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={[styles.status, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  status: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default RoutineCard;