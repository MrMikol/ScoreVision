import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';
import { scheduleReminder, cancelReminder, pauseReminder, requestPermissions, checkPermissions } from '../services/notifications';

const VERSION = '1.0.0';

const PRESET_TIMES = [
  { label: 'Morning', sublabel: '8:00 AM', hour: 8, minute: 0 },
  { label: 'Afternoon', sublabel: '2:00 PM', hour: 14, minute: 0 },
  { label: 'Evening', sublabel: '6:00 PM', hour: 18, minute: 0 },
  { label: 'Night', sublabel: '9:00 PM', hour: 21, minute: 0 },
];

const formatTime = (hour, minute) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  const m = minute < 10 ? '0' + minute : minute;
  return `${h}:${m} ${period}`;
};

const [showCustomTime, setShowCustomTime] = useState(false);
const [customHour, setCustomHour] = useState('18');
const [customMinute, setCustomMinute] = useState('00');

const handleToggleReminders = async (value) => {
  if (value) {
    const granted = await requestPermissions();
    if (!granted) {
      Alert.alert(
        'Permission Required',
        'Please allow notifications in your phone settings to enable reminders.',
        [{ text: 'OK' }]
      );
      return;
    }
    await scheduleReminder(reminderTime.hour, reminderTime.minute);
  } else {
    await cancelReminder();
    setReminderPaused(false);
  }
  setRemindersEnabled(value);
};

const handleSelectPreset = async (preset) => {
  setReminderTime({ hour: preset.hour, minute: preset.minute });
  if (remindersEnabled) {
    await scheduleReminder(preset.hour, preset.minute);
  }
};

const handleCustomTime = async () => {
  const h = parseInt(customHour);
  const m = parseInt(customMinute);
  if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
    Alert.alert('Invalid Time', 'Please enter a valid hour (0-23) and minute (0-59).');
    return;
  }
  setReminderTime({ hour: h, minute: m });
  if (remindersEnabled) {
    await scheduleReminder(h, m);
  }
  setShowCustomTime(false);
};

const handlePause = async () => {
  await pauseReminder(reminderTime.hour, reminderTime.minute);
  setReminderPaused(true);
};

const handleResume = async () => {
  await scheduleReminder(reminderTime.hour, reminderTime.minute);
  setReminderPaused(false);
};

export default function SettingsScreen({ navigation }) {
  const {
    soundEnabled, setSoundEnabled,
    darkMode, setDarkMode,
    showPianoLabels, setShowPianoLabels,
    remindersEnabled, setRemindersEnabled,
    reminderTime, setReminderTime,
    reminderPaused, setReminderPaused,
  } = useSettings();

  const theme = darkMode ? dark : light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={[styles.backText, { color: theme.text }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Sound Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>SOUND</Text>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={[styles.rowLabel, { color: theme.text }]}>Sound Effects</Text>
                <Text style={[styles.rowDesc, { color: theme.muted }]}>
                  Play sounds on correct and wrong answers
                </Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#ccc', true: '#2d7a4f' }}
                thumbColor="white"
              />
            </View>
          </View>
        </View>

        {/* Display Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>DISPLAY</Text>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>

            {/* Dark Mode */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={[styles.rowLabel, { color: theme.text }]}>Dark Mode</Text>
                <Text style={[styles.rowDesc, { color: theme.muted }]}>
                  Switch to a dark theme
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#ccc', true: '#2563a8' }}
                thumbColor="white"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Piano Labels */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={[styles.rowLabel, { color: theme.text }]}>Piano Key Labels</Text>
                <Text style={[styles.rowDesc, { color: theme.muted }]}>
                  Show note names on piano keys
                </Text>
              </View>
              <Switch
                value={showPianoLabels}
                onValueChange={setShowPianoLabels}
                trackColor={{ false: '#ccc', true: '#2563a8' }}
                thumbColor="white"
              />
            </View>

          </View>
        </View>

        {/* Reminders Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>REMINDERS</Text>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>

            {/* Toggle */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={[styles.rowLabel, { color: theme.text }]}>Daily Practice Reminder</Text>
                <Text style={[styles.rowDesc, { color: theme.muted }]}>
                  Get reminded to practice every day
                </Text>
              </View>
              <Switch
                value={remindersEnabled}
                onValueChange={handleToggleReminders}
                trackColor={{ false: '#ccc', true: '#c84b2f' }}
                thumbColor="white"
              />
            </View>

            {/* Time options — only show when enabled */}
            {remindersEnabled && (
              <>
                <View style={[styles.divider, { backgroundColor: theme.border }]} />

                {/* Current time */}
                <View style={styles.row}>
                  <Text style={[styles.rowLabel, { color: theme.text }]}>Reminder Time</Text>
                  <Text style={[styles.rowValue, { color: '#c84b2f' }]}>
                    {formatTime(reminderTime.hour, reminderTime.minute)}
                  </Text>
                </View>

                {/* Preset times */}
                <View style={styles.presetGrid}>
                  {PRESET_TIMES.map(preset => (
                    <TouchableOpacity
                      key={preset.label}
                      style={[
                        styles.presetBtn,
                        { borderColor: theme.border, backgroundColor: theme.card },
                        reminderTime.hour === preset.hour && reminderTime.minute === preset.minute && {
                          borderColor: '#c84b2f',
                          backgroundColor: '#c84b2f10',
                        },
                      ]}
                      onPress={() => handleSelectPreset(preset)}
                    >
                      <Text style={[
                        styles.presetLabel,
                        { color: theme.text },
                        reminderTime.hour === preset.hour && reminderTime.minute === preset.minute && {
                          color: '#c84b2f',
                        },
                      ]}>
                        {preset.label}
                      </Text>
                      <Text style={[styles.presetSublabel, { color: theme.muted }]}>
                        {preset.sublabel}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Custom time toggle */}
                <TouchableOpacity
                  style={[styles.customTimeBtn, { borderColor: theme.border }]}
                  onPress={() => setShowCustomTime(!showCustomTime)}
                >
                  <Text style={[styles.customTimeBtnText, { color: theme.muted }]}>
                    {showCustomTime ? '▲ Hide custom time' : '▼ Set custom time'}
                  </Text>
                </TouchableOpacity>

                {/* Custom time inputs */}
                {showCustomTime && (
                  <View style={styles.customTimeRow}>
                    <TextInput
                      style={[styles.timeInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
                      value={customHour}
                      onChangeText={setCustomHour}
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="HH"
                      placeholderTextColor={theme.muted}
                    />
                    <Text style={[styles.timeSeparator, { color: theme.text }]}>:</Text>
                    <TextInput
                      style={[styles.timeInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
                      value={customMinute}
                      onChangeText={setCustomMinute}
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="MM"
                      placeholderTextColor={theme.muted}
                    />
                    <TouchableOpacity
                      style={styles.setTimeBtn}
                      onPress={handleCustomTime}
                    >
                      <Text style={styles.setTimeBtnText}>Set</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={[styles.divider, { backgroundColor: theme.border }]} />

                {/* Pause/Resume */}
                {!reminderPaused ? (
                  <TouchableOpacity style={styles.row} onPress={handlePause}>
                    <View style={styles.rowLeft}>
                      <Text style={[styles.rowLabel, { color: theme.text }]}>Pause Reminders</Text>
                      <Text style={[styles.rowDesc, { color: theme.muted }]}>
                        Snooze for 7 days
                      </Text>
                    </View>
                    <Text style={{ color: '#c9972b', fontSize: 13, fontFamily: 'monospace' }}>
                      Pause
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.row} onPress={handleResume}>
                    <View style={styles.rowLeft}>
                      <Text style={[styles.rowLabel, { color: theme.text }]}>Reminders Paused</Text>
                      <Text style={[styles.rowDesc, { color: theme.muted }]}>
                        Tap to resume now
                      </Text>
                    </View>
                    <Text style={{ color: '#2d7a4f', fontSize: 13, fontFamily: 'monospace' }}>
                      Resume
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

  </View>
</View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>ABOUT</Text>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>

            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>App</Text>
              <Text style={[styles.rowValue, { color: theme.muted }]}>ScoreVision</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>Version</Text>
              <Text style={[styles.rowValue, { color: theme.muted }]}>{VERSION}</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>Developer</Text>
              <Text style={[styles.rowValue, { color: theme.muted }]}>Michael T</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>Built with</Text>
              <Text style={[styles.rowValue, { color: theme.muted }]}>React Native + Expo</Text>
            </View>

          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── THEMES ──────────────────────────────────────────────────────────────────

const light = {
  bg: '#f5f0e8',
  card: 'white',
  text: '#1a1a1a',
  muted: '#888',
  border: '#e0e0e0',
};

const dark = {
  bg: '#1a1a1a',
  card: '#2c2c2c',
  text: '#f5f0e8',
  muted: '#888',
  border: '#3a3a3a',
};

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    gap: 24,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { padding: 4 },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  card: {
    borderWidth: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  rowLeft: {
    flex: 1,
    gap: 2,
    paddingRight: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  rowValue: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
    marginHorizontal: 14,
  },
  presetGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  paddingHorizontal: 14,
  paddingBottom: 8,
},
presetBtn: {
  flex: 1,
  minWidth: '40%',
  borderWidth: 1.5,
  borderRadius: 6,
  padding: 10,
  alignItems: 'center',
  gap: 2,
},
presetLabel: {
  fontSize: 13,
  fontWeight: '600',
},
presetSublabel: {
  fontSize: 11,
  fontFamily: 'monospace',
},
customTimeBtn: {
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderTopWidth: 1,
  alignItems: 'center',
},
customTimeBtnText: {
  fontSize: 12,
  fontFamily: 'monospace',
  letterSpacing: 1,
},
customTimeRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  paddingHorizontal: 14,
  paddingVertical: 10,
},
timeInput: {
  width: 56,
  height: 44,
  borderWidth: 1.5,
  borderRadius: 6,
  textAlign: 'center',
  fontSize: 18,
  fontWeight: '600',
  fontFamily: 'monospace',
},
timeSeparator: {
  fontSize: 24,
  fontWeight: '700',
},
setTimeBtn: {
  flex: 1,
  backgroundColor: '#1a1a1a',
  paddingVertical: 12,
  borderRadius: 6,
  alignItems: 'center',
},
setTimeBtnText: {
  color: '#f5f0e8',
  fontSize: 14,
  fontWeight: '600',
},
});