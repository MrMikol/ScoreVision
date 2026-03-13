import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import StaffDisplay from '../components/StaffDisplay';
import PianoKeyboard from '../components/PianoKeyboard';
import { TREBLE_NOTES, BASS_NOTES, NOTE_NAMES } from '../data/notes';

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const CORRECT_TO_LEVELUP = 5;

const getPool = (clef, difficulty) => {
  const source = clef === 'treble' ? TREBLE_NOTES : BASS_NOTES;
  let pool = [...source.beginner];
  if (difficulty === 'intermediate') pool = [...pool, ...source.intermediate];
  if (difficulty === 'advanced') pool = [...pool, ...source.intermediate, ...source.advanced];
  return pool;
};

const pickRandom = (pool) => pool[Math.floor(Math.random() * pool.length)];

const getBaseName = (name) => name.replace('#', '').replace('b', '')[0].toUpperCase();

export default function GameScreen({ navigation }) {
  const [clef, setClef] = useState('treble');
  const [difficulty, setDifficulty] = useState('beginner');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctInRow, setCorrectInRow] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [answering, setAnswering] = useState(true);
  const [currentNote, setCurrentNote] = useState(
    () => pickRandom(getPool('treble', 'beginner'))
  );

  const nextNote = useCallback((currentClef, currentDifficulty) => {
    setFeedback(null);
    setAnswering(true);
    setCurrentNote(pickRandom(getPool(currentClef, currentDifficulty)));
  }, []);

  const handleAnswer = useCallback((noteName) => {
    if (!answering) return;

    const correct = getBaseName(noteName) === getBaseName(currentNote.name);
    setAnswering(false);

    if (correct) {
      const newStreak = streak + 1;
      const newCorrectInRow = correctInRow + 1;
      const bonus = newStreak >= 3 ? 20 : 10;
      const multiplier = difficulty === 'advanced' ? 2 : difficulty === 'intermediate' ? 1.5 : 1;

      setScore(prev => prev + Math.round(bonus * multiplier));
      setStreak(newStreak);
      setFeedback('correct');

      // Level up
      if (newCorrectInRow >= CORRECT_TO_LEVELUP) {
        setCorrectInRow(0);
        setLevel(prev => prev + 1);
        const nextDiffIndex = DIFFICULTIES.indexOf(difficulty) + 1;
        if (nextDiffIndex < DIFFICULTIES.length) {
          const nextDiff = DIFFICULTIES[nextDiffIndex];
          setDifficulty(nextDiff);
          setTimeout(() => nextNote(clef, nextDiff), 900);
          return;
        }
      } else {
        setCorrectInRow(newCorrectInRow);
      }
    } else {
      setStreak(0);
      setCorrectInRow(0);
      setFeedback('wrong');
    }

    setTimeout(() => nextNote(clef, difficulty), 900);
  }, [answering, currentNote, streak, correctInRow, difficulty, clef, nextNote]);

  const handleClefChange = (newClef) => {
    setClef(newClef);
    setCurrentNote(pickRandom(getPool(newClef, difficulty)));
    setFeedback(null);
    setAnswering(true);
  };

  const handleSkip = () => {
    setStreak(0);
    setCorrectInRow(0);
    nextNote(clef, difficulty);
  };

  const progressPct = (correctInRow / CORRECT_TO_LEVELUP) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statVal}>{score}</Text>
              <Text style={styles.statLbl}>Score</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statVal, streak >= 3 && styles.streakFire]}>
                {streak}{streak >= 3 ? '🔥' : ''}
              </Text>
              <Text style={styles.statLbl}>Streak</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statVal}>{level}</Text>
              <Text style={styles.statLbl}>Level</Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressWrap}>
          <View style={[styles.progressBar, { width: `${progressPct}%` }]} />
        </View>

        {/* Clef Selector */}
        <View style={styles.pillGroup}>
          {['treble', 'bass'].map(c => (
            <TouchableOpacity
              key={c}
              style={[styles.pill, clef === c && styles.pillActive]}
              onPress={() => handleClefChange(c)}
            >
              <Text style={[styles.pillText, clef === c && styles.pillTextActive]}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Difficulty Badge */}
        <Text style={styles.diffBadge}>{difficulty.toUpperCase()}</Text>

        {/* Staff */}
        <View style={styles.staffWrap}>
          <StaffDisplay note={currentNote} clef={clef} />
          {feedback && (
            <View style={[
              styles.feedbackOverlay,
              feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong
            ]}>
              <Text style={styles.feedbackText}>
                {feedback === 'correct' ? '✓' : '✗'}
              </Text>
            </View>
          )}
        </View>

        {/* Note Buttons */}
        <View style={styles.noteButtons}>
          {NOTE_NAMES.map(note => (
            <TouchableOpacity
              key={note}
              style={styles.noteBtn}
              onPress={() => handleAnswer(note)}
              activeOpacity={0.7}
            >
              <Text style={styles.noteBtnText}>{note}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Divider */}
        <Text style={styles.divider}>— or play on piano —</Text>

        {/* Piano */}
        <PianoKeyboard onKeyPress={handleAnswer} />

        {/* Skip */}
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>skip →</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e8',
  },
  scroll: {
    padding: 16,
    alignItems: 'center',
    gap: 14,
    paddingBottom: 40,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: 'monospace',
  },
  streakFire: {
    color: '#c84b2f',
  },
  statLbl: {
    fontSize: 10,
    opacity: 0.5,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  progressWrap: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#c84b2f',
    borderRadius: 2,
  },
  pillGroup: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#1a1a1a',
    borderRadius: 999,
    overflow: 'hidden',
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 20,
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
  diffBadge: {
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 2,
    opacity: 0.4,
  },
  staffWrap: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  feedbackOverlay: {
    position: 'absolute',
    inset: 0,
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  feedbackCorrect: {
    backgroundColor: 'rgba(45,122,79,0.15)',
  },
  feedbackWrong: {
    backgroundColor: 'rgba(200,75,47,0.15)',
  },
  feedbackText: {
    fontSize: 64,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  noteButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  noteBtn: {
    width: 44,
    height: 52,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#1a1a1a',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  divider: {
    fontFamily: 'monospace',
    fontSize: 11,
    opacity: 0.4,
    letterSpacing: 1,
  },
  skipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.25)',
    borderRadius: 999,
  },
  skipText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: 'rgba(0,0,0,0.4)',
  },
});