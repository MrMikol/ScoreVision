import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// black key positions relative to white keys
const BLACK_KEYS = [
  { note: 'Db', after: 0 },
  { note: 'Eb', after: 1 },
  { note: 'Gb', after: 3 },
  { note: 'Ab', after: 4 },
  { note: 'Bb', after: 5 },
];

const WHITE_KEY_WIDTH = 44;
const WHITE_KEY_HEIGHT = 120;
const BLACK_KEY_WIDTH = 28;
const BLACK_KEY_HEIGHT = 75;

export default function PianoKeyboard({ onKeyPress, highlightKey }) {
  const getBlackKeyLeft = (afterIndex) => {
    return (afterIndex + 1) * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2;
  };

  return (
    <View style={styles.pianoWrapper}>
      <View style={styles.piano}>

        {/* White Keys */}
        {WHITE_KEYS.map((note) => (
          <TouchableOpacity
            key={note}
            style={[
              styles.whiteKey,
              highlightKey === note && styles.whiteKeyHighlight,
            ]}
            onPress={() => onKeyPress(note)}
            activeOpacity={0.7}
          >
            <Text style={styles.whiteKeyLabel}>{note}</Text>
          </TouchableOpacity>
        ))}

        {/* Black Keys */}
        {BLACK_KEYS.map(({ note, after }) => (
          <TouchableOpacity
            key={note}
            style={[
              styles.blackKey,
              { left: getBlackKeyLeft(after) },
            ]}
            onPress={() => onKeyPress(note)}
            activeOpacity={0.7}
          />
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
  whiteKeyHighlight: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563a8',
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
  },
});