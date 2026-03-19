import { useState, useCallback, useEffect, useRef } from 'react';
import { startSession, endSession } from '../services/analytics';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import StaffDisplay from '../components/StaffDisplay';
import PianoKeyboard from '../components/PianoKeyboard';
import {
  NOTE_NAMES,
  ACCIDENTAL_NOTES,
  getPool,
  pickRandom,
  getBaseName,
  hasAccidental,
} from '../data/notes';
import { useSettings } from '../context/SettingsContext';
import { light, dark } from '../context/theme';

// ─── CLEF LOGIC ──────────────────────────────────────────────────────────────
const getClef = (difficulty, noteCount) => {
  if (difficulty === 'easy') return 'treble';
  if (difficulty === 'medium') return Math.random() < 0.5 ? 'treble' : 'bass';
  return Math.floor(noteCount / 3) % 2 === 0 ? 'treble' : 'bass';
};

export default function GameScreen({ navigation, route }) {
  const { difficulty = 'easy', mode = 'endless', option = null, inputMethod = 'both' } = route.params || {};

  const { soundEnabled, darkMode, showPianoLabels } = useSettings();
  const theme = darkMode ? dark : light;

  // ─── STATE ────────────────────────────────────────────────────────────────
  const [clef, setClef] = useState(() => getClef(difficulty, 0));
  const [currentNote, setCurrentNote] = useState(() =>
    pickRandom(getPool('treble', difficulty))
  );
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [noteCount, setNoteCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [answering, setAnswering] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [attemptHistory, setAttemptHistory] = useState([]);

  // Timed mode
  const [timeLeft, setTimeLeft] = useState(mode === 'timed' ? option : null);
  const timerRef = useRef(null);
  const sessionRef = useRef(null);

  // ─── SOUND ────────────────────────────────────────────────────────────────
  
  const correctPlayer = useAudioPlayer(require('../../assets/correct.mp3'));
  const wrongPlayer = useAudioPlayer(require('../../assets/wrong.mp3'));

  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      if (type === 'correct') {
        correctPlayer.seekTo(0);
        correctPlayer.play();
      } else {
        wrongPlayer.seekTo(0);
        wrongPlayer.play();
      }
    } catch (e) {
      console.log('Sound error:', e);
    }
  };

  // ─── TIMER ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (mode === 'timed' && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [mode, gameOver]);

  // ─── END GAME ─────────────────────────────────────────────────────────────
  const endGame = useCallback(() => {
    clearInterval(timerRef.current);
    setGameOver(true);
    setAnswering(false);
  }, []);

  // Navigate to results when gameOver
  useEffect(() => {
    if (gameOver) {
      const finishSession = async () => {
        await endSession(sessionRef.current, {
          total: correct + incorrect,
          correct,
          incorrect,
          bestStreak,
        });

        navigation.replace('Results', {
          score,
          correct,
          incorrect,
          bestStreak,
          total: correct + incorrect,
          difficulty,
          mode,
          option,
          attemptHistory,
        });
      };
      finishSession();
    }
  }, [gameOver]);

  // Start analytics session
  useEffect(() => {
    const initSession = async () => {
      const id = await startSession(difficulty, mode);
      sessionRef.current = id;
    };
    initSession();
  }, []);

  // ─── NEXT NOTE ────────────────────────────────────────────────────────────
  const nextNote = useCallback((count) => {
    const newClef = getClef(difficulty, count);
    setClef(newClef);
    setCurrentNote(pickRandom(getPool(newClef, difficulty)));
    setFeedback(null);
    setAnswering(true);
  }, [difficulty]);

  // ─── HANDLE ANSWER ────────────────────────────────────────────────────────
  const handleAnswer = useCallback((noteName) => {
    if (!answering || gameOver) return;

    // Capture current note immediately before any state changes
    const noteBeingAnswered = currentNote;
    const clefBeingAnswered = clef;

    const ENHARMONIC = {
      'C#': 'Db', 'Db': 'C#',
      'F#': 'Gb', 'Gb': 'F#',
      'Eb': 'D#', 'D#': 'Eb',
      'Ab': 'G#', 'G#': 'Ab',
      'Bb': 'A#', 'A#': 'Bb',
      'Fb': 'E',  'E':  'Fb',
      'Cb': 'B',  'B':  'Cb',
      'E#': 'F',  'F':  'E#',
      'B#': 'C',  'C':  'B#',
    };

    const isAccidentalNote = hasAccidental(noteBeingAnswered);
    let isCorrect = false;

    if (isAccidentalNote) {
      isCorrect =
        noteName === noteBeingAnswered.name ||
        ENHARMONIC[noteName] === noteBeingAnswered.name;
    } else {
      isCorrect = getBaseName(noteName) === getBaseName(noteBeingAnswered.name);
    }

    setAnswering(false);

    // Log attempt using captured values
    setAttemptHistory(prev => [...prev, {
      clef: clefBeingAnswered,
      correctNote: noteBeingAnswered.name,
      correctNoteObj: noteBeingAnswered,
      answeredNote: noteName,
      wasCorrect: isCorrect,
    }]);

    // Increment note count
    const newNoteCount = noteCount + 1;
    setNoteCount(newNoteCount);

    if (isCorrect) {
      const newStreak = streak + 1;
      const newCorrect = correct + 1;
      const bonus = newStreak >= 3 ? 20 : 10;
      const multiplier =
        difficulty === 'hard' ? 2 : difficulty === 'medium' ? 1.5 : 1;

      setScore(prev => prev + Math.round(bonus * multiplier));
      setStreak(newStreak);
      setBestStreak(prev => Math.max(prev, newStreak));
      setCorrect(newCorrect);
      setFeedback('correct');
      playSound('correct');
    } else {
      setStreak(0);
      setIncorrect(prev => prev + 1);
      setFeedback('wrong');
      playSound('wrong');
    }

    // Challenge end check
    if (mode === 'challenge' && newNoteCount >= option) {
      setTimeout(() => endGame(), 900);
      return;
    }

    setTimeout(() => nextNote(newNoteCount), 900);
  }, [answering, gameOver, currentNote, streak, correct, noteCount, difficulty, mode, option, nextNote, endGame, soundEnabled]);

  // ─── SKIP ─────────────────────────────────────────────────────────────────
  const handleSkip = () => {
    if (gameOver) return;

    // Capture current note immediately
    const noteBeingAnswered = currentNote;
    const clefBeingAnswered = clef;

    setStreak(0);
    setIncorrect(prev => prev + 1);
    setFeedback('wrong');
    playSound('wrong');

    setAttemptHistory(prev => [...prev, {
      clef: clefBeingAnswered,
      correctNote: noteBeingAnswered.name,
      correctNoteObj: noteBeingAnswered,
      answeredNote: 'skipped',
      wasCorrect: false,
    }]);

    const newNoteCount = noteCount + 1;
    setNoteCount(newNoteCount);

    if (mode === 'challenge' && newNoteCount >= option) {
      setTimeout(() => endGame(), 900);
      return;
    }

    setTimeout(() => nextNote(newNoteCount), 900);
  };

  // ─── END SESSION (Endless) ────────────────────────────────────────────────
  const handleEndSession = () => {
    Alert.alert(
      'End Session?',
      'Your stats will be saved and shown.',
      [
        { text: 'Keep Playing', style: 'cancel' },
        { text: 'End', style: 'destructive', onPress: endGame },
      ]
    );
  };

  // ─── RENDER NOTE BUTTONS ──────────────────────────────────────────────────
  const renderNoteButtons = () => {
    if (hasAccidental(currentNote)) {
      return (
        <View style={styles.accidentalButtons}>
          {/* Natural notes */}
          <View style={styles.noteButtons}>
            {NOTE_NAMES.map(note => (
              <TouchableOpacity
                key={note}
                style={[styles.noteBtn, { backgroundColor: theme.card, borderColor: theme.text }]}
                onPress={() => handleAnswer(note)}
                activeOpacity={0.7}
              >
                <Text style={[styles.noteBtnText, { color: theme.text }]}>{note}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sharps */}
          <View style={styles.noteButtons}>
            {ACCIDENTAL_NOTES.sharps.map(note => (
              <TouchableOpacity
                key={note}
                style={[styles.noteBtn, styles.noteBtnSharp]}
                onPress={() => handleAnswer(note)}
                activeOpacity={0.7}
              >
                <Text style={styles.noteBtnText}>{note}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Flats */}
          <View style={styles.noteButtons}>
            {ACCIDENTAL_NOTES.flats.map(note => (
              <TouchableOpacity
                key={note}
                style={[styles.noteBtn, styles.noteBtnFlat]}
                onPress={() => handleAnswer(note)}
                activeOpacity={0.7}
              >
                <Text style={styles.noteBtnText}>{note}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.noteButtons}>
        {NOTE_NAMES.map(note => (
          <TouchableOpacity
            key={note}
            style={[styles.noteBtn, { backgroundColor: theme.card, borderColor: theme.text }]}
            onPress={() => handleAnswer(note)}
            activeOpacity={0.7}
          >
            <Text style={[styles.noteBtnText, { color: theme.text }]}>{note}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // ─── PROGRESS ─────────────────────────────────────────────────────────────
  const progressPct = mode === 'challenge'
    ? (noteCount / option) * 100
    : mode === 'timed'
    ? (timeLeft / option) * 100
    : 0;

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={[styles.backText, { color: theme.text }]}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={[styles.statVal, { color: theme.text }]}>{score}</Text>
              <Text style={[styles.statLbl, { color: theme.muted }]}>Score</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statVal, streak >= 3 && styles.streakFire]}>
                {streak}{streak >= 3 ? '🔥' : ''}
              </Text>
              <Text style={[styles.statLbl, { color: theme.muted }]}>Streak</Text>
            </View>
            {mode === 'timed' && (
              <View style={styles.stat}>
                <Text style={[styles.statVal, { color: theme.text }, timeLeft <= 10 && styles.timerWarn]}>
                  {timeLeft}s
                </Text>
                <Text style={[styles.statLbl, { color: theme.muted }]}>Time</Text>
              </View>
            )}
            {mode === 'challenge' && (
              <View style={styles.stat}>
                <Text style={[styles.statVal, { color: theme.text }]}>{noteCount}/{option}</Text>
                <Text style={[styles.statLbl, { color: theme.muted }]}>Notes</Text>
              </View>
            )}
          </View>
        </View>

        {/* Progress Bar */}
        {(mode === 'challenge' || mode === 'timed') && (
          <View style={styles.progressWrap}>
            <View style={[styles.progressBar, { width: `${progressPct}%` }]} />
          </View>
        )}

        {/* Badges */}
        <View style={styles.badges}>
          <Text style={[styles.badge, { color: theme.muted }]}>{difficulty.toUpperCase()}</Text>
          <Text style={[styles.badge, { color: theme.muted }]}>{clef.toUpperCase()} CLEF</Text>
        </View>

        {/* Staff */}
        <View style={styles.staffWrap}>
          <StaffDisplay note={currentNote} clef={clef} />
          {feedback && (
            <View style={[
              styles.feedbackOverlay,
              feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong,
            ]}>
              <Text style={styles.feedbackText}>
                {feedback === 'correct' ? '✓' : '✗'}
              </Text>
            </View>
          )}
        </View>

        {/* Note Buttons */}
        {(inputMethod === 'buttons' || inputMethod === 'both') && renderNoteButtons()}

        {/* Divider */}
        {inputMethod === 'both' && (
          <Text style={[styles.divider, { color: theme.muted }]}>— or play on piano —</Text>
        )}

        {/* Piano */}
        {(inputMethod === 'piano' || inputMethod === 'both') && (
          <PianoKeyboard onKeyPress={handleAnswer} showPianoLabels={showPianoLabels} />
        )}

        {/* Bottom Buttons */}
        <View style={styles.bottomRow}>
          <TouchableOpacity style={[styles.skipBtn, { borderColor: theme.muted }]} onPress={handleSkip}>
            <Text style={[styles.skipText, { color: theme.muted }]}>skip →</Text>
          </TouchableOpacity>

          {mode === 'endless' && (
            <TouchableOpacity style={styles.endBtn} onPress={handleEndSession}>
              <Text style={styles.endBtnText}>■ End Session</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  backBtn: { padding: 8 },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: { alignItems: 'center' },
  statVal: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  streakFire: { color: '#c84b2f' },
  timerWarn: { color: '#c84b2f' },
  statLbl: {
    fontSize: 10,
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
  badges: {
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 2,
  },
  staffWrap: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  feedbackOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  feedbackCorrect: { backgroundColor: 'rgba(45,122,79,0.15)' },
  feedbackWrong: { backgroundColor: 'rgba(200,75,47,0.15)' },
  feedbackText: {
    fontSize: 64,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  accidentalButtons: {
    width: '100%',
    gap: 8,
  },
  noteButtons: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  noteBtn: {
    width: 44,
    height: 52,
    borderWidth: 2,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteBtnSharp: {
    backgroundColor: '#fff8e6',
    borderColor: '#c9972b',
  },
  noteBtnFlat: {
    backgroundColor: '#e6f0ff',
    borderColor: '#2563a8',
  },
  noteBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  skipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderWidth: 1.5,
    borderRadius: 999,
  },
  skipText: {
    fontFamily: 'monospace',
    fontSize: 13,
  },
  endBtn: {
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderWidth: 1.5,
    borderColor: '#c84b2f',
    borderRadius: 999,
  },
  endBtnText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#c84b2f',
  },
});