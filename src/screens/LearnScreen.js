import { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useSettings } from '../context/SettingsContext';
import { light, dark } from '../context/theme';
import StaffDisplay from '../components/StaffDisplay';

// ─── NOTE DATA ────────────────────────────────────────────────────────────────

const TREBLE_LEARN_NOTES = [
  { name: 'C', octave: 4, position: -1, description: 'Middle C — ledger line below treble staff', freq: 261.63 },
  { name: 'D', octave: 4, position: -0.5, description: 'D — just below the treble staff', freq: 293.66 },
  { name: 'E', octave: 4, position: 0, description: 'E — first (bottom) line of treble staff', freq: 329.63 },
  { name: 'F', octave: 4, position: 0.5, description: 'F — first space of treble staff', freq: 349.23 },
  { name: 'G', octave: 4, position: 1, description: 'G — second line of treble staff', freq: 392.00 },
  { name: 'A', octave: 4, position: 1.5, description: 'A — second space of treble staff', freq: 440.00 },
  { name: 'B', octave: 4, position: 2, description: 'B — middle (third) line of treble staff', freq: 493.88 },
  { name: 'C', octave: 5, position: 2.5, description: 'C — third space of treble staff', freq: 523.25 },
  { name: 'D', octave: 5, position: 3, description: 'D — fourth line of treble staff', freq: 587.33 },
  { name: 'E', octave: 5, position: 3.5, description: 'E — fourth space of treble staff', freq: 659.25 },
  { name: 'F', octave: 5, position: 4, description: 'F — fifth (top) line of treble staff', freq: 698.46 },
  { name: 'G', octave: 5, position: 4.5, description: 'G — just above treble staff', freq: 783.99 },
];

const BASS_LEARN_NOTES = [
  { name: 'E', octave: 2, position: -1, description: 'E — ledger line below bass staff', freq: 82.41 },
  { name: 'F', octave: 2, position: -0.5, description: 'F — just below the bass staff', freq: 87.31 },
  { name: 'G', octave: 2, position: 0, description: 'G — first (bottom) line of bass staff', freq: 98.00 },
  { name: 'A', octave: 2, position: 0.5, description: 'A — first space of bass staff', freq: 110.00 },
  { name: 'B', octave: 2, position: 1, description: 'B — second line of bass staff', freq: 123.47 },
  { name: 'C', octave: 3, position: 1.5, description: 'C — second space of bass staff', freq: 130.81 },
  { name: 'D', octave: 3, position: 2, description: 'D — middle (third) line of bass staff', freq: 146.83 },
  { name: 'E', octave: 3, position: 2.5, description: 'E — third space of bass staff', freq: 164.81 },
  { name: 'F', octave: 3, position: 3, description: 'F — fourth line of bass staff', freq: 174.61 },
  { name: 'G', octave: 3, position: 3.5, description: 'G — fourth space of bass staff', freq: 196.00 },
  { name: 'A', octave: 3, position: 4, description: 'A — fifth (top) line of bass staff', freq: 220.00 },
  { name: 'B', octave: 3, position: 4.5, description: 'B — just above bass staff', freq: 246.94 },
];

// ─── TONE.JS HTML ─────────────────────────────────────────────────────────────

const toneHTML = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js"></script>
</head>
<body>
<script>
  const synth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 1.2 },
  }).toDestination();

  document.addEventListener('message', function(e) {
    const freq = parseFloat(e.data);
    if (!isNaN(freq)) {
      Tone.start().then(() => {
        synth.triggerAttackRelease(freq, '2n');
      });
    }
  });

  window.addEventListener('message', function(e) {
    const freq = parseFloat(e.data);
    if (!isNaN(freq)) {
      Tone.start().then(() => {
        synth.triggerAttackRelease(freq, '2n');
      });
    }
  });
</script>
</body>
</html>
`;

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'staff',
    icon: '📖',
    title: 'The Staff',
    content: `The staff is the foundation of written music. It consists of 5 horizontal lines and 4 spaces between them.\n\nNotes are placed on lines or in spaces. The higher a note appears on the staff, the higher its pitch.\n\nEvery note has a specific position on the staff that tells you exactly which note to play.`,
  },
  {
    id: 'clefs',
    icon: '𝄞',
    title: 'Clefs',
    content: `A clef is a symbol placed at the beginning of a staff. It tells you which notes correspond to which lines and spaces.\n\nTreble Clef (𝄞) — also called the G clef. Used for higher pitched instruments like violin, flute, and the right hand of piano. The curl of the clef wraps around the G line.\n\nBass Clef (𝄢) — also called the F clef. Used for lower pitched instruments like cello, tuba, and the left hand of piano. The two dots sit above and below the F line.`,
  },
  {
    id: 'alphabet',
    icon: '🎵',
    title: 'The Musical Alphabet',
    content: `Music uses only 7 letter names:\n\nA  B  C  D  E  F  G\n\nAfter G, the alphabet repeats again from A — just at a higher pitch. This repetition is called an octave.\n\nA helpful way to remember treble clef lines:\nEvery Good Boy Does Fine (E G B D F)\n\nAnd the spaces spell:\nFACE`,
  },
  {
    id: 'accidentals',
    icon: '♯♭',
    title: 'Sharps & Flats',
    content: `Sharps (♯) raise a note by one half step — to the next key on the piano.\n\nFlats (♭) lower a note by one half step — to the previous key on the piano.\n\nThe black keys on a piano are all sharps or flats. Each black key has two names:\n\nC#/Db  D#/Eb  F#/Gb  G#/Ab  A#/Bb\n\nThese pairs are called enharmonic equivalents — same sound, different name.`,
  },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function LearnScreen({ navigation }) {
  const { darkMode } = useSettings();
  const theme = darkMode ? dark : light;

  const [activeTab, setActiveTab] = useState('notes');
  const [clef, setClef] = useState('treble');
  const [selectedNote, setSelectedNote] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const webViewRef = useRef(null);

  const notes = clef === 'treble' ? TREBLE_LEARN_NOTES : BASS_LEARN_NOTES;

  const handleNotePress = (note) => {
    setSelectedNote(note);
    if (webViewRef.current) {
        webViewRef.current.postMessage(String(note.freq));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>

      {/* Hidden WebView for audio */}
      <View style={{ width: 0, height: 0, overflow: 'hidden', position: 'absolute' }}>
        <WebView
            ref={webViewRef}
            source={{ html: toneHTML }}
            style={{ width: 1, height: 1 }}
            javaScriptEnabled
            onMessage={() => {}}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={[styles.backText, { color: theme.text }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Learn</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Tabs */}
        <View style={[styles.tabRow, { borderColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'notes' && { borderBottomColor: '#c84b2f', borderBottomWidth: 2 }]}
            onPress={() => setActiveTab('notes')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'notes' ? '#c84b2f' : theme.muted }]}>
              🎵 Notes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'theory' && { borderBottomColor: '#c84b2f', borderBottomWidth: 2 }]}
            onPress={() => setActiveTab('theory')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'theory' ? '#c84b2f' : theme.muted }]}>
              📖 Theory
            </Text>
          </TouchableOpacity>
        </View>

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <View style={styles.notesTab}>

            {/* Clef selector */}
            <View style={styles.pillGroup}>
              <TouchableOpacity
                style={[styles.pill, clef === 'treble' && styles.pillActive]}
                onPress={() => { setClef('treble'); setSelectedNote(null); }}
              >
                <Text style={[styles.pillText, clef === 'treble' && styles.pillTextActive]}>
                  Treble
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pill, clef === 'bass' && styles.pillActive]}
                onPress={() => { setClef('bass'); setSelectedNote(null); }}
              >
                <Text style={[styles.pillText, clef === 'bass' && styles.pillTextActive]}>
                  Bass
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.hint, { color: theme.muted }]}>
              Tap a note to see its name and hear it play
            </Text>

            {/* Note grid */}
            <View style={styles.noteGrid}>
              {notes.map((note, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.noteCard,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    selectedNote?.name === note.name && selectedNote?.octave === note.octave && {
                      borderColor: '#c84b2f',
                      backgroundColor: '#c84b2f10',
                    },
                  ]}
                  onPress={() => handleNotePress(note)}
                  activeOpacity={0.7}
                >
                  <StaffDisplay note={note} clef={clef} small />
                  <Text style={[styles.noteCardName, { color: theme.text }]}>
                    {note.name}{note.octave}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Selected note info */}
            {selectedNote && (
              <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: '#c84b2f' }]}>
                <Text style={[styles.infoNote, { color: '#c84b2f' }]}>
                  {selectedNote.name}{selectedNote.octave}
                </Text>
                <Text style={[styles.infoDesc, { color: theme.text }]}>
                  {selectedNote.description}
                </Text>
                <Text style={[styles.infoFreq, { color: theme.muted }]}>
                  {selectedNote.freq} Hz
                </Text>
              </View>
            )}

          </View>
        )}

        {/* THEORY TAB */}
        {activeTab === 'theory' && (
          <View style={styles.theoryTab}>
            {SECTIONS.map(section => (
              <TouchableOpacity
                key={section.id}
                style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => setExpandedSection(
                  expandedSection === section.id ? null : section.id
                )}
                activeOpacity={0.8}
              >
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionIcon}>{section.icon}</Text>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
                  <Text style={[styles.sectionChevron, { color: theme.muted }]}>
                    {expandedSection === section.id ? '▲' : '▼'}
                  </Text>
                </View>
                {expandedSection === section.id && (
                  <Text style={[styles.sectionContent, { color: theme.text }]}>
                    {section.content}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    gap: 16,
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
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  notesTab: {
    gap: 16,
    width: '100%',
  },
  pillGroup: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#1a1a1a',
    borderRadius: 999,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  pillActive: {
    backgroundColor: '#1a1a1a',
  },
  pillText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#1a1a1a',
  },
  pillTextActive: {
    color: '#f5f0e8',
  },
  hint: {
    fontSize: 12,
    fontFamily: 'monospace',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  noteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  noteCard: {
    width: '44%',
    borderWidth: 2,
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
    gap: 6,
  },
  noteCardName: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  infoCard: {
    borderWidth: 2,
    borderRadius: 6,
    padding: 16,
    gap: 6,
    alignItems: 'center',
  },
  infoNote: {
    fontSize: 36,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  infoDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoFreq: {
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  theoryTab: {
    gap: 10,
    width: '100%',
  },
  sectionCard: {
    borderWidth: 2,
    borderRadius: 6,
    padding: 14,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  sectionChevron: {
    fontSize: 12,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
  },
});