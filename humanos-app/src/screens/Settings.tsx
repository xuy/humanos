import React, { useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const { refreshRoutines } = useRoutines();
  
  // Load initial values
  React.useEffect(() => {
    const loadSettings = async () => {
      const url = await AsyncStorage.getItem(STORAGE_KEYS.JSON_URL);
      if (url) setJsonUrlState(url);
      
      const devMode = await AsyncStorage.getItem('developer_mode');
      setDeveloperMode(devMode === 'true');
    };
    loadSettings();
  }, []);
  
  const handleSaveUrl = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.JSON_URL, jsonUrl);
      Alert.alert('Success', 'JSON URL updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save JSON URL');
    }
  };
  
  const handleToggleDeveloperMode = async (value: boolean) => {
    setDeveloperMode(value);
    await AsyncStorage.setItem('developer_mode', value.toString());
  };
  
  const handleRefreshRoutines = async () => {
    setIsLoading(true);
    try {
      await refreshRoutines();
      Alert.alert('Success', 'Routines refreshed successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh routines');
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ROUTINES);
      await AsyncStorage.removeItem(STORAGE_KEYS.LAST_FETCH_DATE);
      Alert.alert('Success', 'Cache cleared successfully');
      handleRefreshRoutines();
    } catch (error) {
      Alert.alert('Error', 'Failed to clear cache');
    }
  };
  
  const clearTodayStatus = async () => {
    try {
      const statusesJson = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINE_STATUS);
      if (statusesJson) {
        const statuses = JSON.parse(statusesJson);
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Only clear today's statuses
        const updatedStatuses = Object.fromEntries(
          Object.entries(statuses).filter(([_, value]) => {
            const lastUpdated = (value as any).lastUpdated;
            return lastUpdated && !lastUpdated.startsWith(currentDate);
          })
        );
        
        await AsyncStorage.setItem(STORAGE_KEYS.ROUTINE_STATUS, JSON.stringify(updatedStatuses));
        Alert.alert('Success', "Today's statuses cleared successfully");
        handleRefreshRoutines();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to clear today\'s statuses');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>JSON Source</Text>
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
          onPress={handleSaveUrl}
        >
          <Text style={styles.buttonText}>Save URL</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleRefreshRoutines}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Refreshing...' : 'Refresh Routines'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={clearCache}
        >
          <Text style={styles.buttonText}>Clear Cache</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={clearTodayStatus}
        >
          <Text style={styles.buttonText}>Clear Today's Status</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Developer Options</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Developer Mode</Text>
          <Switch
            value={developerMode}
            onValueChange={handleToggleDeveloperMode}
          />
        </View>
      </View>
      
      {developerMode && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Raw JSON</Text>
          <View style={styles.jsonContainer}>
            <Text style={styles.jsonText}>{rawJson}</Text>
          </View>
        </View>
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
  disabledButton: {
    opacity: 0.5,
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
  },
});

export default Settings;