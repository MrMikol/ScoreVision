import { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showPianoLabels, setShowPianoLabels] = useState(true);

  return (
    <SettingsContext.Provider value={{
      soundEnabled, setSoundEnabled,
      darkMode, setDarkMode,
      showPianoLabels, setShowPianoLabels,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}