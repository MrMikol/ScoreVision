import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useSettings } from '../context/SettingsContext';

const VERSION = '1.0.0';

export default function SettingsScreen({ navigation }) {
  const {
    soundEnabled, setSoundEnabled,
    darkMode, setDarkMode,
    showPianoLabels, setShowPianoLabels,
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
});