import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();

const STORAGE_KEY = 'scorevision_settings';

export function SettingsProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showPianoLabels, setShowPianoLabels] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState({ hour: 8, minute: 0 });
  const [reminderPaused, setReminderPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load saved settings on app start
  useEffect(() => {
    async function loadSettings() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.soundEnabled !== undefined) setSoundEnabled(parsed.soundEnabled);
          if (parsed.darkMode !== undefined) setDarkMode(parsed.darkMode);
          if (parsed.showPianoLabels !== undefined) setShowPianoLabels(parsed.showPianoLabels);
          if (parsed.remindersEnabled !== undefined) setRemindersEnabled(parsed.remindersEnabled);
          if (parsed.reminderTime !== undefined) setReminderTime(parsed.reminderTime);
          if (parsed.reminderPaused !== undefined) setReminderPaused(parsed.reminderPaused);
        }
      } catch (e) {
        console.warn('Failed to load settings:', e);
      } finally {
        setLoaded(true);
      }
    }
    loadSettings();
  }, []);

  // Save settings whenever any value changes
  useEffect(() => {
    if (!loaded) return; // Don't save before initial load completes
    async function saveSettings() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
          soundEnabled,
          darkMode,
          showPianoLabels,
          remindersEnabled,
          reminderTime,
          reminderPaused,
        }));
      } catch (e) {
        console.warn('Failed to save settings:', e);
      }
    }
    saveSettings();
  }, [soundEnabled, darkMode, showPianoLabels, remindersEnabled, reminderTime, reminderPaused, loaded]);

  if (!loaded) return null; // Wait for settings to load before rendering

  return (
    <SettingsContext.Provider value={{
      soundEnabled, setSoundEnabled,
      darkMode, setDarkMode,
      showPianoLabels, setShowPianoLabels,
      remindersEnabled, setRemindersEnabled,
      reminderTime, setReminderTime,
      reminderPaused, setReminderPaused,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}