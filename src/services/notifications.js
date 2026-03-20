import * as Notifications from 'expo-notifications';

// ─── SETUP ───────────────────────────────────────────────────────────────────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ─── PERMISSIONS ─────────────────────────────────────────────────────────────

export const requestPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const checkPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
};

// ─── MESSAGES ────────────────────────────────────────────────────────────────

const REMINDER_MESSAGES = [
  { title: 'Time to practice! 🎵', body: 'Keep your sight reading sharp today.' },
  { title: 'Daily practice time! 🎶', body: 'A few minutes a day makes a big difference.' },
  { title: 'ScoreVision is waiting! 🎼', body: 'Your streak is counting on you!' },
  { title: 'Ready to read some notes? 🎹', body: 'Jump in for a quick session!' },
  { title: 'Practice makes perfect! 🏆', body: 'Open ScoreVision and keep improving.' },
];

const getRandomMessage = () => {
  return REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];
};

// ─── SCHEDULE ────────────────────────────────────────────────────────────────

export const scheduleReminder = async (hour, minute) => {
  try {
    // Cancel any existing reminders first
    await cancelReminder();

    const message = getRandomMessage();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: true,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });

    console.log(`Reminder scheduled for ${hour}:${minute < 10 ? '0' + minute : minute}`);
    return true;
  } catch (e) {
    console.log('scheduleReminder error:', e);
    return false;
  }
};

export const cancelReminder = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Reminders cancelled');
  } catch (e) {
    console.log('cancelReminder error:', e);
  }
};

// ─── PAUSE (cancel for 7 days) ────────────────────────────────────────────────

export const pauseReminder = async (hour, minute) => {
  try {
    await cancelReminder();

    // Schedule to resume in 7 days
    const resumeDate = new Date();
    resumeDate.setDate(resumeDate.getDate() + 7);
    resumeDate.setHours(hour, minute, 0, 0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Welcome back! 🎵',
        body: 'Your practice reminders are back. Time to play!',
        sound: true,
      },
      trigger: {
        date: resumeDate,
      },
    });

    console.log('Reminders paused for 7 days');
    return true;
  } catch (e) {
    console.log('pauseReminder error:', e);
    return false;
  }
};