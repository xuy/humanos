import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RoutineWithStatus } from '../types';
import { isRoutineActive, isNextUp } from '../utils/routines';

// Tag to emoji mapping
const TAG_EMOJIS: Record<string, string> = {
  'morning': '☀️',
  'evening': '🌙',
  'hydration': '💧',
  'shower': '🚿',
  'sleep': '😴',
  'fitness': '💪',
  'health': '❤️',
  'wake': '⏰',
  'daily': '📅',
  'weekly': '📆'
};

type RoutineCardProps = {
  routine: RoutineWithStatus;
  onPress: (routine: RoutineWithStatus) => void;
  currentTime?: Date;
};

const RoutineCard: React.FC<RoutineCardProps> = ({ routine, onPress, currentTime = new Date() }) => {
  const isActive = isRoutineActive(routine);
  const isNext = isNextUp(routine, currentTime);
  
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
      style={[
        styles.card,
        { borderLeftColor: getStatusColor() },
        isNext && styles.nextUpCard
      ]}
      onPress={() => onPress(routine)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.titleRow}>
          {routine.emoji && (
            <Text style={styles.emoji}>{routine.emoji}</Text>
          )}
          <Text style={styles.title}>{routine.name}</Text>
        </View>
        <Text style={styles.time}>
          {routine.trigger.start} - {routine.trigger.end}
        </Text>
        <View style={styles.tags}>
          {routine.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>
                {TAG_EMOJIS[tag] ? `${TAG_EMOJIS[tag]} ` : ''}{tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.statusContainer}>
        {isNext && (
          <View style={styles.nextUpBadge}>
            <Text style={styles.nextUpText}>Next Up</Text>
          </View>
        )}
        <View style={[styles.status, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
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
  nextUpCard: {
    backgroundColor: '#FFF8E1', // Light yellow background for next up
    borderLeftColor: '#FFC107', // Amber border for next up
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  emoji: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  nextUpBadge: {
    backgroundColor: '#FFC107',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  nextUpText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '500',
  },
  status: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default RoutineCard;