import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Switch,
  ScrollView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useRoutines from '../hooks/useRoutines';

const STORAGE_KEYS = {
  ROUTINES: 'humanos_routines',
  JSON_URL: 'humanos_json_url',
  ROUTINE_STATUS: 'humanos_routine_status',
  LAST_FETCH_DATE: 'humanos_last_fetch_date',
  LAST_RESET_DATE: 'humanos_last_reset_date',
};

const Settings: React.FC = () => {
  const [jsonUrl, setJsonUrlState] = useState('');
  const [developerMode, setDeveloperMode] = useState(false);
  const [rawJson, setRawJson] = useState('');
  const [statusData, setStatusData] = useState('');
  const { refreshRoutines } = useRoutines();
  
  // Function to update status display
  const updateStatusDisplay = async () => {
    if (developerMode) {
      try {
        const statusJson = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINE_STATUS);
        if (statusJson) {
          setStatusData(JSON.stringify(JSON.parse(statusJson), null, 2));
        } else {
          setStatusData('{}');
        }
      } catch (_err) {
        // Error already handled by setting error message
        setStatusData('Error loading status data');
      }
    }
  };
  
  // Load initial values
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const url = await AsyncStorage.getItem(STORAGE_KEYS.JSON_URL);
        if (url) {
          setJsonUrlState(url);
        }
      } catch (_err) {
        // Ignore error, will use default URL
      }
    };

    loadSettings();
    updateStatusDisplay();
  }, [developerMode]);

  // Update status when developer mode changes
  useEffect(() => {
    updateStatusDisplay();
  }, [developerMode]);
  
  // Function to update JSON URL
  const updateJsonUrl = async (url: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.JSON_URL, url);
      await refreshRoutines();
    } catch (_err) {
      Alert.alert('Error', 'Failed to update JSON URL');
    }
  };

  // Function to re-fetch JSON from URL
  const refetchJson = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.LAST_FETCH_DATE);
      await refreshRoutines();
      Alert.alert('Success', 'Routines refreshed from URL');
    } catch (_err) {
      Alert.alert('Error', 'Failed to refresh routines');
    }
  };
  
  // Function to reset all data
  const resetAllData = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ROUTINES,
        STORAGE_KEYS.JSON_URL,
        STORAGE_KEYS.ROUTINE_STATUS,
        STORAGE_KEYS.LAST_FETCH_DATE,
        STORAGE_KEYS.LAST_RESET_DATE,
      ]);
      await refreshRoutines();
    } catch (_err) {
      Alert.alert('Error', 'Failed to reset data');
    }
  };

  // Function to clear today's status
  const clearTodayStatus = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const statusJson = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINE_STATUS);
      if (statusJson) {
        const status = JSON.parse(statusJson);
        delete status[today];
        await AsyncStorage.setItem(STORAGE_KEYS.ROUTINE_STATUS, JSON.stringify(status));
        await updateStatusDisplay();
        Alert.alert('Success', 'Today\'s status cleared');
      }
    } catch (_err) {
      Alert.alert('Error', 'Failed to clear today\'s status');
    }
  };

  // Function to save raw JSON
  const saveRawJson = async () => {
    try {
      const data = JSON.parse(rawJson);
      await AsyncStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(data.routines));
      await refreshRoutines();
    } catch (_err) {
      Alert.alert('Error', 'Failed to save JSON data');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>JSON Source URL</Text>
        <TextInput
          style={styles.input}
          value={jsonUrl}
          onChangeText={setJsonUrlState}
          placeholder="Enter JSON URL"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity 
          style={styles.button}
          onPress={() => updateJsonUrl(jsonUrl)}
        >
          <Text style={styles.buttonText}>Update URL</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Developer Mode</Text>
        <Switch
          value={developerMode}
          onValueChange={setDeveloperMode}
        />
      </View>
      
      {developerMode && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Raw JSON Data</Text>
            <TextInput
              style={[styles.input, styles.jsonInput]}
              value={rawJson}
              onChangeText={setRawJson}
              placeholder="Paste JSON data here"
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity 
              style={styles.button}
              onPress={saveRawJson}
            >
              <Text style={styles.buttonText}>Save JSON</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status Data</Text>
            <Text style={styles.jsonText}>{statusData}</Text>
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]}
              onPress={clearTodayStatus}
            >
              <Text style={styles.buttonText}>Clear Today's Status</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]}
              onPress={refetchJson}
            >
              <Text style={styles.buttonText}>Re-fetch JSON from URL</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <TouchableOpacity 
              style={[styles.button, styles.dangerButton]}
              onPress={resetAllData}
            >
              <Text style={styles.buttonText}>Reset All Data</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryButton: {
    backgroundColor: '#5856D6',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
  },
  jsonContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 12,
  },
  jsonInput: {
    height: 120,
    textAlignVertical: 'top',
  },
});

export default Settings;