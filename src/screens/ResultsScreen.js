import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import StaffDisplay from '../components/StaffDisplay';
import { useSettings } from '../context/SettingsContext';
import { light, dark } from '../context/theme';

const DIFFICULTY_COLORS = {
  easy: '#2d7a4f',
  medium: '#c9972b',
  hard: '#c84b2f',
};

const MODE_LABELS = {
  challenge: '🎯 Challenge',
  timed: '⏱ Time Attack',
  endless: '♾ Endless',
};

export default function ResultsScreen({ navigation, route }) {
  const {
    score = 0,
    correct = 0,
    incorrect = 0,
    bestStreak = 0,
    total = 0,
    difficulty = 'easy',
    mode = 'endless',
    option = null,
    attemptHistory = [],
  } = route.params || {};

  const [showReview, setShowReview] = useState(false);

  const { darkMode } = useSettings();
  const theme = darkMode ? dark : light;

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const diffColor = DIFFICULTY_COLORS[difficulty];

  const getGrade = () => {
    if (accuracy >= 90) return { label: 'A', color: '#2d7a4f' };
    if (accuracy >= 75) return { label: 'B', color: '#2563a8' };
    if (accuracy >= 60) return { label: 'C', color: '#c9972b' };
    if (accuracy >= 45) return { label: 'D', color: '#c84b2f' };
    return { label: 'F', color: '#888' };
  };

  const getMotivation = () => {
    if (accuracy >= 90) return "Excellent! No room for improvement! 🏆";
    if (accuracy >= 75) return 'Great work! Keep that momentum going! 🎵';
    if (accuracy >= 60) return 'Good effort! Practice makes perfect! 💪';
    if (accuracy >= 45) return "Keep going! You're improving! 🎶";
    return 'Every musician starts somewhere. Keep practicing! 🌱';
  };

  const getMostMissed = () => {
    const missed = {};
    attemptHistory
      .filter(a => !a.wasCorrect && a.answeredNote !== 'skipped')
      .forEach(a => {
        missed[a.correctNote] = (missed[a.correctNote] || 0) + 1;
      });
    return Object.entries(missed)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  const grade = getGrade();
  const mostMissed = getMostMissed();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Session Complete</Text>
          <View style={styles.modeBadgeRow}>
            <View style={[styles.modeBadge, { borderColor: diffColor }]}>
              <Text style={[styles.modeBadgeText, { color: diffColor }]}>
                {difficulty.toUpperCase()}
              </Text>
            </View>
            <View style={[styles.modeBadge, { borderColor: theme.border }]}>
              <Text style={[styles.modeBadgeText, { color: theme.text }]}>
                {MODE_LABELS[mode]}
                {option ? `  ·  ${mode === 'timed' ? option + 's' : option + ' notes'}` : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Grade Card */}
        <View style={[styles.gradeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.gradeText, { color: grade.color }]}>
            {grade.label}
          </Text>
          <Text style={[styles.accuracyText, { color: theme.text }]}>{accuracy}%</Text>
          <Text style={[styles.accuracyLabel, { color: theme.muted }]}>Accuracy</Text>
          <Text style={[styles.motivation, { color: theme.muted }]}>{getMotivation()}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statCardVal, { color: theme.text }]}>{score}</Text>
            <Text style={[styles.statCardLbl, { color: theme.muted }]}>Total Score</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statCardVal, { color: theme.text }]}>{total}</Text>
            <Text style={[styles.statCardLbl, { color: theme.muted }]}>Notes Played</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statCardVal, { color: '#2d7a4f' }]}>{correct}</Text>
            <Text style={[styles.statCardLbl, { color: theme.muted }]}>Correct</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statCardVal, { color: '#c84b2f' }]}>{incorrect}</Text>
            <Text style={[styles.statCardLbl, { color: theme.muted }]}>Incorrect</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statCardVal, { color: '#c84b2f' }]}>
              {bestStreak}🔥
            </Text>
            <Text style={[styles.statCardLbl, { color: theme.muted }]}>Best Streak</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statCardVal, { color: theme.text }]}>
              {difficulty === 'hard' ? '×2' : difficulty === 'medium' ? '×1.5' : '×1'}
            </Text>
            <Text style={[styles.statCardLbl, { color: theme.muted }]}>Multiplier</Text>
          </View>
        </View>

        {/* Most Missed — Endless only */}
        {mode === 'endless' && mostMissed.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.muted }]}>Most Missed Notes</Text>
            <View style={styles.missedList}>
              {mostMissed.map(([note, count]) => (
                <View key={note} style={styles.missedRow}>
                  <Text style={[styles.missedNote, { color: theme.text }]}>{note}</Text>
                  <View style={[styles.missedBar, { backgroundColor: theme.border }]}>
                    <View style={[styles.missedBarFill, { width: `${Math.min(count * 20, 100)}%` }]} />
                  </View>
                  <Text style={styles.missedCount}>×{count}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Review Button — Challenge and Timed only */}
        {(mode === 'challenge' || mode === 'timed') && attemptHistory.length > 0 && (
          <TouchableOpacity
            style={[styles.reviewBtn, { borderColor: theme.text }]}
            onPress={() => setShowReview(!showReview)}
          >
            <Text style={[styles.reviewBtnText, { color: theme.text }]}>
              {showReview ? '▲ Hide Review' : '▼ Review Answers'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Review List */}
        {showReview && (
          <View style={styles.reviewList}>
            <Text style={[styles.sectionTitle, { color: theme.muted }]}>Answer Review</Text>
            {attemptHistory.map((attempt, index) => (
              <View
                key={index}
                style={[
                  styles.reviewCard,
                  attempt.wasCorrect ? styles.reviewCorrect : styles.reviewWrong,
                ]}
              >
                {/* Staff diagram */}
                <View style={styles.reviewStaff}>
                  <StaffDisplay
                    note={attempt.correctNoteObj}
                    clef={attempt.clef}
                    small
                  />
                </View>

                {/* Note info */}
                <View style={styles.reviewLeft}>
                  <Text style={styles.reviewClef}>
                    {attempt.clef.toUpperCase()} CLEF
                  </Text>
                  <View style={styles.reviewNoteRow}>
                    <View style={styles.reviewNoteItem}>
                      <Text style={styles.reviewNoteLabel}>Correct</Text>
                      <Text style={styles.reviewNoteName}>
                        {attempt.correctNote}
                      </Text>
                    </View>
                    <Text style={styles.reviewArrow}>→</Text>
                    <View style={styles.reviewNoteItem}>
                      <Text style={styles.reviewNoteLabel}>You answered</Text>
                      <Text style={[
                        styles.reviewNoteName,
                        !attempt.wasCorrect && { color: '#c84b2f' },
                      ]}>
                        {attempt.answeredNote}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Result */}
                <Text style={[
                  styles.reviewResult,
                  attempt.wasCorrect ? { color: '#2d7a4f' } : { color: '#c84b2f' },
                ]}>
                  {attempt.wasCorrect ? '✓' : '✗'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: theme.btnPrimary }]}
            onPress={() => navigation.replace('GameSetup')}
          >
            <Text style={[styles.btnPrimaryText, { color: theme.btnPrimaryText }]}>
              ▶  Play Again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnSecondary, { borderColor: theme.btnSecondaryBorder }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={[styles.btnSecondaryText, { color: theme.btnSecondaryText }]}>
              ⌂  Home
            </Text>
          </TouchableOpacity>
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
    padding: 20,
    alignItems: 'center',
    gap: 20,
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  modeBadgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderRadius: 999,
  },
  modeBadgeText: {
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 1,
  },
  gradeCard: {
    width: '100%',
    borderWidth: 2,
    borderRadius: 6,
    padding: 28,
    alignItems: 'center',
    gap: 4,
  },
  gradeText: {
    fontSize: 80,
    fontWeight: '900',
    lineHeight: 88,
  },
  accuracyText: {
    fontSize: 36,
    fontWeight: '700',
  },
  accuracyLabel: {
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  motivation: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  statsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '28%',
    borderWidth: 2,
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statCardVal: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  statCardLbl: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  section: {
    width: '100%',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'monospace',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  missedList: {
    width: '100%',
    gap: 8,
  },
  missedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  missedNote: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: '700',
    width: 32,
  },
  missedBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  missedBarFill: {
    height: '100%',
    backgroundColor: '#c84b2f',
    borderRadius: 4,
  },
  missedCount: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#c84b2f',
    width: 28,
    textAlign: 'right',
  },
  reviewBtn: {
    width: '100%',
    paddingVertical: 14,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
  },
  reviewBtnText: {
    fontFamily: 'monospace',
    fontSize: 13,
    letterSpacing: 1,
  },
  reviewList: {
    width: '100%',
    gap: 8,
  },
  reviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 6,
    padding: 12,
  },
  reviewCorrect: {
    borderColor: '#2d7a4f',
    backgroundColor: '#f0faf4',
  },
  reviewWrong: {
    borderColor: '#c84b2f',
    backgroundColor: '#fff5f5',
  },
  reviewStaff: {
    marginBottom: 10,
  },
  reviewLeft: {
    gap: 6,
    flex: 1,
  },
  reviewClef: {
    fontFamily: 'monospace',
    fontSize: 9,
    letterSpacing: 2,
    opacity: 0.4,
    textTransform: 'uppercase',
  },
  reviewNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reviewNoteItem: {
    gap: 2,
  },
  reviewNoteLabel: {
    fontSize: 9,
    opacity: 0.4,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  reviewNoteName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    fontFamily: 'monospace',
  },
  reviewArrow: {
    fontSize: 16,
    opacity: 0.3,
    marginTop: 10,
  },
  reviewResult: {
    fontSize: 28,
    fontWeight: '900',
  },
  actions: {
    width: '100%',
    gap: 12,
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
});