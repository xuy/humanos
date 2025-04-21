import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View } from 'react-native';

// Import screens
import DailyDashboard from '../screens/DailyDashboard';
import RoutineRunner from '../screens/RoutineRunner';
import WeeklyView from '../screens/WeeklyView';
import Settings from '../screens/Settings';

// Define navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  RoutineRunner: { routine: any };
};

export type TabParamList = {
  Daily: undefined;
  Weekly: undefined;
  Settings: undefined;
};

// Create navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Tab icon component
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => (
  <View style={{ 
    backgroundColor: focused ? '#007AFF' : '#F0F0F0',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4
  }}>
    <Text style={{ 
      color: focused ? '#FFF' : '#666',
      fontWeight: focused ? 'bold' : 'normal',
      fontSize: 14
    }}>
      {name.charAt(0)}
    </Text>
  </View>
);

// Tab navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F0F0F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        }
      }}
    >
      <Tab.Screen 
        name="Daily" 
        component={DailyDashboard}
        options={{
          tabBarLabel: 'Today',
          tabBarIcon: ({ focused }) => <TabIcon name="Today" focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="Weekly" 
        component={WeeklyView}
        options={{
          tabBarLabel: 'Weekly',
          tabBarIcon: ({ focused }) => <TabIcon name="Weekly" focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon name="Settings" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Main app navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="RoutineRunner" 
          component={RoutineRunner}
          options={{ 
            headerShown: false,
            presentation: 'fullScreenModal',
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;