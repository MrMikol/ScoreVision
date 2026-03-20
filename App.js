import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsProvider } from './src/context/SettingsContext';
import { syncToSheets } from './src/services/sync';
import * as Notifications from 'expo-notifications';
import { scheduleReminder } from './src/services/notifications';

import HomeScreen from './src/screens/HomeScreen';
import GameSetupScreen from './src/screens/GameSetupScreen';
import GameScreen from './src/screens/GameScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import LearnScreen from './src/screens/LearnScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    const init = async () => {
      // Sync analytics
      syncToSheets();

      // Schedule default reminder on first launch
      const { status } = await Notifications.getPermissionsAsync();
      if (status === 'granted') {
        await scheduleReminder(8, 0);
      } else {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus === 'granted') {
          await scheduleReminder(8, 0);
        }
      }
    };
    init();
  }, []);
}