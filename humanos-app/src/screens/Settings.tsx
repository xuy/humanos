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
import { getJsonUrl, setJsonUrl, fetchRoutines } from '../utils/routines';

const Settings: React.FC = () => {
  const [jsonUrl, setJsonUrlState] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [developerMode, setDeveloperMode] = useState<boolean>(false);
  const [rawJson, setRawJson] = useState<string>('');
  
  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Get JSON URL
        const url = await getJsonUrl();
        setJsonUrlState(url);
        
        // Get developer mode setting
        const devMode = await AsyncStorage.getItem('humanos_developer_mode');
        setDeveloperMode(devMode === 'true');
        
        // If developer mode is enabled, load raw JSON
        if (devMode === 'true') {
          const routinesJson = await AsyncStorage.getItem('humanos_routines');
          if (routinesJson) {
            setRawJson(JSON.stringify(JSON.parse(routinesJson), null, 2));
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  // Save JSON URL
  const handleSaveUrl = async () => {
    try {
      if (!jsonUrl.trim()) {
        Alert.alert('Error', 'Please enter a valid URL');
        return;
      }
      
      await setJsonUrl(jsonUrl);
      Alert.alert('Success', 'JSON URL has been saved');
    } catch (error) {
      console.error('Error saving URL:', error);
      Alert.alert('Error', 'Failed to save URL');
    }
  };
  
  // Refresh routines from URL
  const handleRefreshRoutines = async () => {
    setIsLoading(true);
    
    try {
      await fetchRoutines(true);
      
      // If developer mode is enabled, update raw JSON
      if (developerMode) {
        const routinesJson = await AsyncStorage.getItem('humanos_routines');
        if (routinesJson) {
          setRawJson(JSON.stringify(JSON.parse(routinesJson), null, 2));
        }
      }
      
      Alert.alert('Success', 'Routines have been refreshed');
    } catch (error) {
      console.error('Error refreshing routines:', error);
      Alert.alert('Error', 'Failed to refresh routines');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle developer mode
  const handleToggleDeveloperMode = async (value: boolean) => {
    try {
      setDeveloperMode(value);
      await AsyncStorage.setItem('humanos_developer_mode', value ? 'true' : 'false');
      
      // If enabling developer mode, load raw JSON
      if (value) {
        const routinesJson = await AsyncStorage.getItem('humanos_routines');
        if (routinesJson) {
          setRawJson(JSON.stringify(JSON.parse(routinesJson), null, 2));
        }
      }
    } catch (error) {
      console.error('Error toggling developer mode:', error);
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
    marginBottom: 24,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  jsonContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    maxHeight: 300,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
});

export default Settings;