import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── KEYS ────────────────────────────────────────────────────────────────────
const KEY_USER_ID = 'scorevision_user_id';
const KEY_SESSIONS = 'scorevision_sessions';
const KEY_LAST_SYNC = 'scorevision_last_sync';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

// Generate a random anonymous ID
const generateUserID = () => {
  return 'user_' + Math.random().toString(36).substring(2, 10);
};

// Get or create the anonymous user ID
export const getUserID = async () => {
  try {
    let id = await AsyncStorage.getItem(KEY_USER_ID);
    if (!id) {
      id = generateUserID();
      await AsyncStorage.setItem(KEY_USER_ID, id);
    }
    return id;
  } catch (e) {
    console.log('getUserID error:', e);
    return null;
  }
};

// ─── SESSION TRACKING ────────────────────────────────────────────────────────

// Call this when a game starts
export const startSession = async (difficulty, mode) => {
  try {
    const session = {
      id: Math.random().toString(36).substring(2, 10),
      startTime: new Date().toISOString(),
      endTime: null,
      duration: null,
      difficulty,
      mode,
      rounds: 0,
      correct: 0,
      incorrect: 0,
      accuracy: 0,
      bestStreak: 0,
    };

    // Load existing sessions
    const existing = await getSessions();
    existing.push(session);
    await AsyncStorage.setItem(KEY_SESSIONS, JSON.stringify(existing));

    return session.id;
  } catch (e) {
    console.log('startSession error:', e);
    return null;
  }
};

// Call this when a game ends
export const endSession = async (sessionId, stats) => {
  try {
    const sessions = await getSessions();
    const index = sessions.findIndex(s => s.id === sessionId);

    if (index === -1) return;

    const startTime = new Date(sessions[index].startTime);
    const endTime = new Date();
    const durationMinutes = Math.round((endTime - startTime) / 1000 / 60);

    sessions[index] = {
      ...sessions[index],
      endTime: endTime.toISOString(),
      duration: durationMinutes,
      rounds: stats.total || 0,
      correct: stats.correct || 0,
      incorrect: stats.incorrect || 0,
      accuracy: stats.total > 0
        ? Math.round((stats.correct / stats.total) * 100)
        : 0,
      bestStreak: stats.bestStreak || 0,
    };

    await AsyncStorage.setItem(KEY_SESSIONS, JSON.stringify(sessions));
    await cleanOldSessions();
  } catch (e) {
    console.log('endSession error:', e);
  }
};

// ─── GET SESSIONS ─────────────────────────────────────────────────────────────

export const getSessions = async () => {
  try {
    const raw = await AsyncStorage.getItem(KEY_SESSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.log('getSessions error:', e);
    return [];
  }
};

// ─── CLEANUP ─────────────────────────────────────────────────────────────────

// Delete sessions older than 1 month
export const cleanOldSessions = async () => {
  try {
    const sessions = await getSessions();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const filtered = sessions.filter(s => {
      return new Date(s.startTime) > oneMonthAgo;
    });

    await AsyncStorage.setItem(KEY_SESSIONS, JSON.stringify(filtered));
  } catch (e) {
    console.log('cleanOldSessions error:', e);
  }
};

// ─── WEEKLY SUMMARY ──────────────────────────────────────────────────────────

export const getWeeklySummary = async () => {
  try {
    const userID = await getUserID();
    const sessions = await getSessions();

    // Filter to last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklySessions = sessions.filter(s =>
      new Date(s.startTime) > oneWeekAgo && s.endTime !== null
    );

    if (weeklySessions.length === 0) return null;

    // Total sessions
    const totalSessions = weeklySessions.length;

    // Total playtime
    const totalPlaytime = weeklySessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    // Most played difficulty
    const difficultyCounts = {};
    weeklySessions.forEach(s => {
      difficultyCounts[s.difficulty] = (difficultyCounts[s.difficulty] || 0) + 1;
    });
    const topDifficulty = Object.entries(difficultyCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'easy';

    // Most played game mode
    const modeCounts = {};
    weeklySessions.forEach(s => {
      modeCounts[s.mode] = (modeCounts[s.mode] || 0) + 1;
    });
    const topMode = Object.entries(modeCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'endless';

    return {
      userID,
      weekStart: oneWeekAgo.toISOString().split('T')[0],
      totalSessions,
      totalPlaytime,
      topDifficulty,
      topMode,
    };
  } catch (e) {
    console.log('getWeeklySummary error:', e);
    return null;
  }
};

// ─── SYNC CHECK ───────────────────────────────────────────────────────────────

// Check if a week has passed since last sync
export const shouldSync = async () => {
  try {
    const lastSync = await AsyncStorage.getItem(KEY_LAST_SYNC);
    if (!lastSync) return true;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(lastSync) < oneWeekAgo;
  } catch (e) {
    return false;
  }
};

// Mark sync as done
export const markSynced = async () => {
  try {
    await AsyncStorage.setItem(KEY_LAST_SYNC, new Date().toISOString());
  } catch (e) {
    console.log('markSynced error:', e);
  }
};