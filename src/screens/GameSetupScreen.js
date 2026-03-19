import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';
import { light, dark } from '../context/theme';

const DIFFICULTIES = [
  {
    id: 'easy',
    label: 'Easy',
    description: 'Treble clef only, notes within the staff, no accidentals',
    color: '#2d7a4f',
  },
  {
    id: 'medium',
    label: 'Medium',
    description: 'Treble & Bass clef, includes ledger lines, no accidentals',
    color: '#c9972b',
  },
  {
    id: 'hard',
    label: 'Hard',
    description: 'Both clefs, full range, key signatures with sharps & flats',
    color: '#c84b2f',
  },
];

const GAME_MODES = [
  {
    id: 'challenge',
    label: '🎯 Challenge',
    description: 'Guess a set number of notes',
    options: [
      { label: '10 notes', value: 10 },
      { label: '20 notes', value: 20 },
      { label: '30 notes', value: 30 },
    ],
  },
  {
    id: 'timed',
    label: '⏱ Time Attack',
    description: 'Answer as many as possible before time runs out',
    options: [
      { label: '60 sec', value: 60 },
      { label: '90 sec', value: 90 },
      { label: '120 sec', value: 120 },
    ],
  },
  {
    id: 'endless',
    label: '♾ Endless',
    description: 'Keep going until you decide to stop',
    options: [],
  },
];

const INPUT_METHODS = [
  {
    id: 'buttons',
    label: '🎵 Note Buttons',
    description: 'Tap C D E F G A B buttons to answer',
  },
  {
    id: 'piano',
    label: '🎹 Virtual Piano',
    description: 'Tap the matching key on the piano to answer',
  },
  {
    id: 'both',
    label: '🎵🎹 Both',
    description: 'Show both note buttons and virtual piano',
  },
];

export default function GameSetupScreen({ navigation }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedInput, setSelectedInput] = useState(null);

  const { darkMode } = useSettings();
  const theme = darkMode ? dark : light;

  const selectedModeData = GAME_MODES.find(m => m.id === selectedMode);

  const canStart =
    selectedDifficulty !== null &&
    selectedMode !== null &&
    (selectedMode === 'endless' || selectedOption !== null) &&
    selectedInput !== null;

  const handleStart = () => {
    navigation.navigate('Game', {
      difficulty: selectedDifficulty,
      mode: selectedMode,
      option: selectedOption,
      inputMethod: selectedInput,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={[styles.backText, { color: theme.text }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Game Setup</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Step 1 - Difficulty */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>01 — Select Difficulty</Text>
          <View style={styles.cards}>
            {DIFFICULTIES.map(d => (
              <TouchableOpacity
                key={d.id}
                style={[
                  styles.card,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  selectedDifficulty === d.id && {
                    borderColor: d.color,
                    backgroundColor: d.color + '10',
                  },
                ]}
                onPress={() => setSelectedDifficulty(d.id)}
              >
                <View style={styles.cardTop}>
                  <Text style={[
                    styles.cardLabel,
                    { color: theme.text },
                    selectedDifficulty === d.id && { color: d.color },
                  ]}>
                    {d.label}
                  </Text>
                  {selectedDifficulty === d.id && (
                    <Text style={[styles.checkmark, { color: d.color }]}>✓</Text>
                  )}
                </View>
                <Text style={[styles.cardDesc, { color: theme.muted }]}>{d.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Step 2 - Game Mode */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>02 — Select Game Mode</Text>
          <View style={styles.cards}>
            {GAME_MODES.map(m => (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.card,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  selectedMode === m.id && {
                    borderColor: '#2563a8',
                    backgroundColor: '#2563a810',
                  },
                ]}
                onPress={() => {
                  setSelectedMode(m.id);
                  setSelectedOption(null);
                }}
              >
                <View style={styles.cardTop}>
                  <Text style={[
                    styles.cardLabel,
                    { color: theme.text },
                    selectedMode === m.id && styles.cardLabelActive,
                  ]}>
                    {m.label}
                  </Text>
                  {selectedMode === m.id && (
                    <Text style={styles.checkmarkBlue}>✓</Text>
                  )}
                </View>
                <Text style={[styles.cardDesc, { color: theme.muted }]}>{m.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Step 3 - Mode Options */}
        {selectedModeData && selectedModeData.options.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.muted }]}>
              {selectedMode === 'challenge' ? '03 — How many notes?' : '03 — How long?'}
            </Text>
            <View style={styles.optionRow}>
              {selectedModeData.options.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.optionBtn,
                    { borderColor: theme.border, backgroundColor: theme.card },
                    selectedOption === opt.value && styles.optionBtnActive,
                  ]}
                  onPress={() => setSelectedOption(opt.value)}
                >
                  <Text style={[
                    styles.optionText,
                    { color: theme.text },
                    selectedOption === opt.value && styles.optionTextActive,
                  ]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 4 - Input Method */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>04 — Select Input Method</Text>
          <View style={styles.cards}>
            {INPUT_METHODS.map(m => (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.card,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  selectedInput === m.id && {
                    borderColor: '#2563a8',
                    backgroundColor: '#2563a810',
                  },
                ]}
                onPress={() => setSelectedInput(m.id)}
              >
                <View style={styles.cardTop}>
                  <Text style={[
                    styles.cardLabel,
                    { color: theme.text },
                    selectedInput === m.id && styles.cardLabelActive,
                  ]}>
                    {m.label}
                  </Text>
                  {selectedInput === m.id && (
                    <Text style={styles.checkmarkBlue}>✓</Text>
                  )}
                </View>
                <Text style={[styles.cardDesc, { color: theme.muted }]}>{m.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startBtn, !canStart && styles.startBtnDisabled]}
          onPress={handleStart}
          disabled={!canStart}
        >
          <Text style={[styles.startBtnText, !canStart && { color: '#999' }]}>
            {canStart ? '▶  Start Game' : 'Complete setup above'}
          </Text>
        </TouchableOpacity>

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
    gap: 24,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 4,
  },
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
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'monospace',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  cards: {
    gap: 10,
  },
  card: {
    borderWidth: 2,
    borderRadius: 6,
    padding: 14,
    gap: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardLabelActive: {
    color: '#2563a8',
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '700',
  },
  checkmarkBlue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563a8',
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: 'center',
  },
  optionBtnActive: {
    borderColor: '#1a1a1a',
    backgroundColor: '#1a1a1a',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  optionTextActive: {
    color: '#f5f0e8',
  },
  startBtn: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 18,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  startBtnDisabled: {
    backgroundColor: '#e0e0e0',
  },
  startBtnText: {
    color: '#f5f0e8',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
});