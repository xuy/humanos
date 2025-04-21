import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import { RoutineWithStatus, Step } from '../types';
import useRoutines from '../hooks/useRoutines';

type RoutineRunnerProps = {
  route: { params: { routine: RoutineWithStatus } };
  navigation: any;
};

const RoutineRunner: React.FC<RoutineRunnerProps> = ({ route, navigation }) => {
  const { routine } = route.params;
  const { updateRoutineStatus } = useRoutines();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const currentStep = routine.steps[currentStepIndex];
  const totalSteps = routine.steps.length;
  const isLastStep = currentStepIndex === totalSteps - 1;
  
  const handleNextStep = () => {
    if (isLastStep) {
      // Mark routine as completed
      updateRoutineStatus(routine.id, 'completed');
      // Navigate back to dashboard
      navigation.goBack();
    } else {
      // Move to next step
      setCurrentStepIndex(prev => prev + 1);
    }
  };
  
  const handleExit = () => {
    // If not completed, keep in progress
    if (currentStepIndex > 0 && !isLastStep) {
      updateRoutineStatus(routine.id, 'in_progress');
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.routineName}>{routine.name}</Text>
        <Text style={styles.progress}>
          Step {currentStepIndex + 1} of {totalSteps}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.mainContent} 
        activeOpacity={0.8}
        onPress={handleNextStep}
      >
        <View style={styles.stepContainer}>
          <Text style={styles.stepText}>{currentStep.text}</Text>
          
          {currentStep.intention && (
            <Text style={styles.intentionText}>
              {currentStep.intention}
            </Text>
          )}
          
          {currentStep.duration && (
            <View style={styles.durationContainer}>
              <Text style={styles.durationText}>
                Duration: {currentStep.duration} min
              </Text>
            </View>
          )}
        </View>
        
        <Text style={styles.tapPrompt}>
          {isLastStep ? 'Tap to complete routine' : 'Tap to continue'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.exitButton}
          onPress={handleExit}
        >
          <Text style={styles.exitButtonText}>Exit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  routineName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progress: {
    fontSize: 14,
    color: '#666',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  stepContainer: {
    width: width - 48,
    alignItems: 'center',
    padding: 24,
  },
  stepText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  intentionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  durationContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 16,
  },
  durationText: {
    fontSize: 14,
    color: '#444',
  },
  tapPrompt: {
    fontSize: 14,
    color: '#999',
    position: 'absolute',
    bottom: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  exitButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  exitButtonText: {
    fontSize: 16,
    color: '#666',
  },
});

export default RoutineRunner;