import { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showPianoLabels, setShowPianoLabels] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState({ hour: 18, minute: 0 }); // default 6PM
  const [reminderPaused, setReminderPaused] = useState(false);

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