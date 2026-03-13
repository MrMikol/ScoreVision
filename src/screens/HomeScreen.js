 
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* App Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Score</Text>
        <Text style={styles.titleAccent}>Vision</Text>
        <Text style={styles.subtitle}>Music Sight Reading Trainer</Text>
      </View>

      {/* Menu Buttons */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('Game')}
        >
          <Text style={styles.btnPrimaryText}>▶  Start Training</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.btnSecondaryText}>⚙  Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>v1.0.0</Text>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e8',
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
    color: '#1a1a1a',
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
    color: '#1a1a1a',
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
    backgroundColor: '#1a1a1a',
    paddingVertical: 18,
    borderRadius: 4,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#f5f0e8',
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
    borderColor: '#1a1a1a',
  },
  btnSecondaryText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footer: {
    opacity: 0.3,
    fontSize: 12,
    fontFamily: 'monospace',
  },
});