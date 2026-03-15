import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSettings } from '../context/SettingsContext';

const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Black keys with correct enharmonic names
// Dual labels for commonly used enharmonic pairs
const BLACK_KEYS = [
  { note: 'C#', label: 'C#\nDb', after: 0 },  // between C and D
  { note: 'Eb', label: 'Eb',     after: 1 },  // between D and E
  { note: 'F#', label: 'F#\nGb', after: 3 },  // between F and G
  { note: 'Ab', label: 'Ab',     after: 4 },  // between G and A
  { note: 'Bb', label: 'Bb',     after: 5 },  // between A and B
];

const WHITE_KEY_WIDTH = 44;
const WHITE_KEY_HEIGHT = 120;
const BLACK_KEY_WIDTH = 28;
const BLACK_KEY_HEIGHT = 75;

export default function PianoKeyboard({ onKeyPress }) {
  const { showPianoLabels } = useSettings();
  const getBlackKeyLeft = (afterIndex) => {
    // +1 accounts for the marginHorizontal: 1 on each white key
    const whiteKeyWithMargin = WHITE_KEY_WIDTH + 2;
    return (afterIndex + 1) * whiteKeyWithMargin - BLACK_KEY_WIDTH / 2 - 1;
  };

  return (
    <View style={styles.pianoWrapper}>
      <View style={styles.piano}>

        {/* White Keys */}
        {WHITE_KEYS.map((note) => (
          <TouchableOpacity
            key={note}
            style={styles.whiteKey}
            onPress={() => onKeyPress(note)}
            activeOpacity={0.7}
          >
            {showPianoLabels && (
              <Text style={styles.whiteKeyLabel}>{note}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Black Keys */}
        {BLACK_KEYS.map(({ note, label, after }) => (
          <TouchableOpacity
            key={note}
            style={[
              styles.blackKey,
              { left: getBlackKeyLeft(after) },
            ]}
            onPress={() => onKeyPress(note)}
            activeOpacity={0.7}
          >
            {showPianoLabels && (
              <Text style={styles.blackKeyLabel}>{label}</Text>
            )}
          </TouchableOpacity>
        ))}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pianoWrapper: {
    alignItems: 'center',
    marginVertical: 8,
  },
  piano: {
    flexDirection: 'row',
    position: 'relative',
    height: WHITE_KEY_HEIGHT,
  },
  whiteKey: {
    width: WHITE_KEY_WIDTH,
    height: WHITE_KEY_HEIGHT,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#888',
    borderRadius: 4,
    marginHorizontal: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
    zIndex: 1,
  },
  whiteKeyLabel: {
    fontSize: 11,
    color: '#888',
    fontFamily: 'monospace',
  },
  blackKey: {
    position: 'absolute',
    width: BLACK_KEY_WIDTH,
    height: BLACK_KEY_HEIGHT,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    zIndex: 2,
    top: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 5,
  },
  blackKeyLabel: {
    fontSize: 7,
    color: '#aaa',
    fontFamily: 'monospace',
    textAlign: 'center',
    lineHeight: 9,
  },
});