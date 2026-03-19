import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { getGameHistory } from '../services/analytics';
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

const getGrade = (accuracy) => {
  if (accuracy >= 90) return { label: 'A', color: '#2d7a4f' };
  if (accuracy >= 75) return { label: 'B', color: '#2563a8' };
  if (accuracy >= 60) return { label: 'C', color: '#c9972b' };
  if (accuracy >= 45) return { label: 'D', color: '#c84b2f' };
  return { label: 'F', color: '#888' };
};

const formatDate = (iso) => {
  const date = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000 / 60);

  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff}m ago`;
  if (diff < 60 * 24) return `${Math.floor(diff / 60)}h ago`;
  if (diff < 60 * 24 * 7) return `${Math.floor(diff / 60 / 24)}d ago`;
  return date.toLocaleDateString();
};

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const { darkMode } = useSettings();
  const theme = darkMode ? dark : light;

  useEffect(() => {
    const load = async () => {
      const data = await getGameHistory();
      setHistory(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={[styles.backText, { color: theme.text }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Recent Games</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Empty state */}
        {!loading && history.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎵</Text>
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              No games played yet.{'\n'}Start training to see your history!
            </Text>
          </View>
        )}

        {/* History List */}
        {history.map((item, index) => {
          const grade = getGrade(item.accuracy);
          const diffColor = DIFFICULTY_COLORS[item.difficulty];

          return (
            <View
              key={item.id || index}
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              {/* Top row */}
              <View style={styles.cardTop}>
                <View style={styles.cardLeft}>
                  <Text style={[styles.gradeText, { color: grade.color }]}>
                    {grade.label}
                  </Text>
                </View>
                <View style={styles.cardMiddle}>
                  <View style={styles.badgeRow}>
                    <View style={[styles.badge, { borderColor: diffColor }]}>
                      <Text style={[styles.badgeText, { color: diffColor }]}>
                        {item.difficulty.toUpperCase()}
                      </Text>
                    </View>
                    <View style={[styles.badge, { borderColor: theme.border }]}>
                      <Text style={[styles.badgeText, { color: theme.muted }]}>
                        {MODE_LABELS[item.mode]}
                        {item.option
                          ? ` · ${item.mode === 'timed' ? item.option + 's' : item.option + ' notes'}`
                          : ''}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.statsRow}>
                    <Text style={[styles.statItem, { color: theme.text }]}>
                      {item.accuracy}% accuracy
                    </Text>
                    <Text style={[styles.statDot, { color: theme.muted }]}>·</Text>
                    <Text style={[styles.statItem, { color: theme.text }]}>
                      {item.total} notes
                    </Text>
                    <Text style={[styles.statDot, { color: theme.muted }]}>·</Text>
                    <Text style={[styles.statItem, { color: theme.text }]}>
                      {item.score} pts
                    </Text>
                  </View>
                </View>
                <Text style={[styles.dateText, { color: theme.muted }]}>
                  {formatDate(item.date)}
                </Text>
              </View>

              {/* Bottom row */}
              <View style={[styles.cardBottom, { borderTopColor: theme.border }]}>
                <Text style={[styles.bottomStat, { color: theme.muted }]}>
                  ✓ {item.correct} correct
                </Text>
                <Text style={[styles.bottomStat, { color: theme.muted }]}>
                  ✗ {item.incorrect} incorrect
                </Text>
                <Text style={[styles.bottomStat, { color: theme.muted }]}>
                  🔥 {item.bestStreak} streak
                </Text>
              </View>
            </View>
          );
        })}

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
    gap: 12,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    borderWidth: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  cardLeft: {
    width: 36,
    alignItems: 'center',
  },
  gradeText: {
    fontSize: 28,
    fontWeight: '900',
  },
  cardMiddle: {
    flex: 1,
    gap: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statItem: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  statDot: {
    fontSize: 12,
  },
  dateText: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
  },
  bottomStat: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
});