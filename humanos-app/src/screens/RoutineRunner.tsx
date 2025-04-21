import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  SafeAreaView,
  Dimensions,
  Alert,
  Platform
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
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const currentStep = routine.steps[currentStepIndex];
  const totalSteps = routine.steps.length;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const isFirstStep = currentStepIndex === 0;
  
  const navigateBack = () => {
    if (Platform.OS === 'web') {
      navigation.navigate('MainTabs', {
        screen: 'Daily'
      });
    } else {
      navigation.goBack();
    }
  };

  const handleNextStep = () => {
    // Mark current step as completed
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps([...completedSteps, currentStepIndex]);
    }

    if (isLastStep) {
      // Only mark as completed if all steps are done (not skipped)
      if (completedSteps.length === totalSteps - 1) {
        updateRoutineStatus(routine.id, 'completed');
      } else {
        updateRoutineStatus(routine.id, 'in_progress');
      }
      navigateBack();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSkipStep = () => {
    if (isLastStep) {
      // If skipping last step, mark as in_progress
      updateRoutineStatus(routine.id, 'in_progress');
      navigateBack();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };
  
  const handleExit = () => {
    // If we have completed steps, keep them in progress
    if (completedSteps.length > 0) {
      updateRoutineStatus(routine.id, 'in_progress');
    }
    navigateBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleExit}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.routineName}>{routine.name}</Text>
          <Text style={styles.progress}>
            Step {currentStepIndex + 1} of {totalSteps}
          </Text>
        </View>
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
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={[styles.navButton, isFirstStep && styles.disabledButton]}
            onPress={handlePreviousStep}
            disabled={isFirstStep}
          >
            <Text style={[styles.navButtonText, isFirstStep && styles.disabledButtonText]}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navButton}
            onPress={handleSkipStep}
          >
            <Text style={styles.navButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
  },
  headerContent: {
    flex: 1,
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
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 16,
    color: '#2196F3',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#999',
  },
});

export default RoutineRunner;