import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { light, dark } from '../context/theme';

export default function HomeScreen({ navigation }) {
  const { darkMode } = useSettings();
  const theme = darkMode ? dark : light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>

      {/* App Title */}
      <View style={[styles.header, { marginTop: 60 }]}>
        <Text style={[styles.title, { color: theme.text }]}>Score</Text>
        <Text style={styles.titleAccent}>Vision</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          Music Sight Reading Trainer
        </Text>
      </View>

      {/* Menu Buttons */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={[styles.btnPrimary, { backgroundColor: theme.btnPrimary }]}
          onPress={() => navigation.navigate('GameSetup')}
        >
          <Text style={[styles.btnPrimaryText, { color: theme.btnPrimaryText }]}>
            ▶  Start Training
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnSecondary, { borderColor: theme.btnSecondaryBorder }]}
          onPress={() => navigation.navigate('Learn')}
        >
          <Text style={[styles.btnSecondaryText, { color: theme.btnSecondaryText }]}>
            𝄞  Learn
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnSecondary, { borderColor: theme.btnSecondaryBorder }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={[styles.btnSecondaryText, { color: theme.btnSecondaryText }]}>
            ⚙  Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footerRow}>
        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={[styles.historyBtnText, { color: theme.muted }]}>📊 Recent Games</Text>
        </TouchableOpacity>
        <Text style={[styles.footer, { color: theme.muted }]}>v1.0.0</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -1,
  },
  titleAccent: {
    fontSize: 52,
    fontWeight: '900',
    color: '#c84b2f',
    letterSpacing: -1,
    marginTop: -20,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.5,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  menu: {
    width: '80%',
    gap: 16,
  },
  btnPrimary: {
    paddingVertical: 18,
    borderRadius: 4,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 2,
  },
  btnSecondaryText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footer: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  footerRow: {
  alignItems: 'center',
  gap: 8,
  },
  historyBtn: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 999,
  },
  historyBtnText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});