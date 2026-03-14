// ─── TREBLE CLEF NOTES ───────────────────────────────────────────────────────

export const TREBLE_NOTES = {
  easy: [
    { name: 'E', octave: 4, position: 0 },
    { name: 'F', octave: 4, position: 0.5 },
    { name: 'G', octave: 4, position: 1 },
    { name: 'A', octave: 4, position: 1.5 },
    { name: 'B', octave: 4, position: 2 },
    { name: 'C', octave: 5, position: 2.5 },
    { name: 'D', octave: 5, position: 3 },
    { name: 'E', octave: 5, position: 3.5 },
    { name: 'F', octave: 5, position: 4 },
  ],
  medium: [
    // Within staff (same as easy)
    { name: 'E', octave: 4, position: 0 },
    { name: 'F', octave: 4, position: 0.5 },
    { name: 'G', octave: 4, position: 1 },
    { name: 'A', octave: 4, position: 1.5 },
    { name: 'B', octave: 4, position: 2 },
    { name: 'C', octave: 5, position: 2.5 },
    { name: 'D', octave: 5, position: 3 },
    { name: 'E', octave: 5, position: 3.5 },
    { name: 'F', octave: 5, position: 4 },
    // Ledger lines below
    { name: 'C', octave: 4, position: -1 },
    { name: 'D', octave: 4, position: -0.5 },
    // Ledger lines above
    { name: 'G', octave: 5, position: 4.5 },
    { name: 'A', octave: 5, position: 5 },
    { name: 'B', octave: 5, position: 5.5 },
    { name: 'C', octave: 6, position: 6 },
  ],
  hard: [
    // Full range same as medium
    { name: 'E', octave: 4, position: 0 },
    { name: 'F', octave: 4, position: 0.5 },
    { name: 'G', octave: 4, position: 1 },
    { name: 'A', octave: 4, position: 1.5 },
    { name: 'B', octave: 4, position: 2 },
    { name: 'C', octave: 5, position: 2.5 },
    { name: 'D', octave: 5, position: 3 },
    { name: 'E', octave: 5, position: 3.5 },
    { name: 'F', octave: 5, position: 4 },
    { name: 'C', octave: 4, position: -1 },
    { name: 'D', octave: 4, position: -0.5 },
    { name: 'G', octave: 5, position: 4.5 },
    { name: 'A', octave: 5, position: 5 },
    { name: 'B', octave: 5, position: 5.5 },
    { name: 'C', octave: 6, position: 6 },
    // Accidentals
    { name: 'F#', octave: 4, position: 0.5, accidental: 'sharp' },
    { name: 'C#', octave: 5, position: 2.5, accidental: 'sharp' },
    { name: 'G#', octave: 4, position: 1, accidental: 'sharp' },
    { name: 'D#', octave: 5, position: 3, accidental: 'sharp' },
    { name: 'A#', octave: 4, position: 1.5, accidental: 'sharp' },
    { name: 'Bb', octave: 4, position: 1.5, accidental: 'flat' },
    { name: 'Eb', octave: 5, position: 2.5, accidental: 'flat' },
    { name: 'Ab', octave: 4, position: 1, accidental: 'flat' },
    { name: 'Db', octave: 5, position: 3, accidental: 'flat' },
    { name: 'Gb', octave: 4, position: 0.5, accidental: 'flat' },
  ],
};

// ─── BASS CLEF NOTES ─────────────────────────────────────────────────────────

export const BASS_NOTES = {
  easy: [
    { name: 'G', octave: 2, position: 0 },
    { name: 'A', octave: 2, position: 0.5 },
    { name: 'B', octave: 2, position: 1 },
    { name: 'C', octave: 3, position: 1.5 },
    { name: 'D', octave: 3, position: 2 },
    { name: 'E', octave: 3, position: 2.5 },
    { name: 'F', octave: 3, position: 3 },
    { name: 'G', octave: 3, position: 3.5 },
    { name: 'A', octave: 3, position: 4 },
  ],
  medium: [
    // Within staff
    { name: 'G', octave: 2, position: 0 },
    { name: 'A', octave: 2, position: 0.5 },
    { name: 'B', octave: 2, position: 1 },
    { name: 'C', octave: 3, position: 1.5 },
    { name: 'D', octave: 3, position: 2 },
    { name: 'E', octave: 3, position: 2.5 },
    { name: 'F', octave: 3, position: 3 },
    { name: 'G', octave: 3, position: 3.5 },
    { name: 'A', octave: 3, position: 4 },
    // Ledger lines below
    { name: 'F', octave: 2, position: -0.5 },
    { name: 'E', octave: 2, position: -1 },
    // Ledger lines above
    { name: 'B', octave: 3, position: 4.5 },
    { name: 'C', octave: 4, position: 5 },
    { name: 'D', octave: 4, position: 5.5 },
  ],
  hard: [
    // Full range same as medium
    { name: 'G', octave: 2, position: 0 },
    { name: 'A', octave: 2, position: 0.5 },
    { name: 'B', octave: 2, position: 1 },
    { name: 'C', octave: 3, position: 1.5 },
    { name: 'D', octave: 3, position: 2 },
    { name: 'E', octave: 3, position: 2.5 },
    { name: 'F', octave: 3, position: 3 },
    { name: 'G', octave: 3, position: 3.5 },
    { name: 'A', octave: 3, position: 4 },
    { name: 'F', octave: 2, position: -0.5 },
    { name: 'E', octave: 2, position: -1 },
    { name: 'B', octave: 3, position: 4.5 },
    { name: 'C', octave: 4, position: 5 },
    { name: 'D', octave: 4, position: 5.5 },
    // Accidentals
    { name: 'F#', octave: 2, position: -0.5, accidental: 'sharp' },
    { name: 'C#', octave: 3, position: 1.5, accidental: 'sharp' },
    { name: 'G#', octave: 2, position: 0, accidental: 'sharp' },
    { name: 'Bb', octave: 2, position: 1, accidental: 'flat' },
    { name: 'Eb', octave: 3, position: 2.5, accidental: 'flat' },
    { name: 'Ab', octave: 2, position: 0.5, accidental: 'flat' },
    { name: 'Db', octave: 3, position: 1.5, accidental: 'flat' },
    { name: 'Gb', octave: 2, position: -0.5, accidental: 'flat' },
  ],
};

// ─── NOTE NAMES ──────────────────────────────────────────────────────────────

export const NOTE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const ACCIDENTAL_NOTES = {
  sharps: ['C#', 'D#', 'F#', 'G#', 'A#'],
  flats: ['Db', 'Eb', 'Gb', 'Ab', 'Bb'],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export const getPool = (clef, difficulty) => {
  const source = clef === 'treble' ? TREBLE_NOTES : BASS_NOTES;
  return source[difficulty] || source.easy;
};

export const pickRandom = (pool) => pool[Math.floor(Math.random() * pool.length)];

export const getBaseName = (name) => {
  return name.replace('#', '').replace('b', '')[0].toUpperCase();
};

export const hasAccidental = (note) => {
  return note?.accidental === 'sharp' || note?.accidental === 'flat';
};