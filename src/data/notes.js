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
    // Within staff
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
    // Full range (same as medium)
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
    // Accidentals — 7 unique accidentals, no enharmonic duplicates
    // Sharps for F# and C# (most common), flats for the rest
    { name: 'F#', octave: 4, position: 0.5, accidental: 'sharp' }, // F space
    { name: 'C#', octave: 5, position: 2.5, accidental: 'sharp' }, // C space
    { name: 'Bb', octave: 4, position: 2,   accidental: 'flat'  }, // B line
    { name: 'Eb', octave: 5, position: 3.5, accidental: 'flat'  }, // E space
    { name: 'Ab', octave: 4, position: 1.5, accidental: 'flat'  }, // A space
    { name: 'Db', octave: 5, position: 3,   accidental: 'flat'  }, // D line ← FIXED (was 2.5)
    { name: 'Gb', octave: 4, position: 1,   accidental: 'flat'  }, // G line
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
    // Full range (same as medium)
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
    // Accidentals — 7 unique accidentals, no enharmonic duplicates
    // Sharps for F# and C# (most common), flats for the rest
    { name: 'F#', octave: 2, position: -0.5, accidental: 'sharp' }, // F ledger line
    { name: 'C#', octave: 3, position: 1.5,  accidental: 'sharp' }, // C space
    { name: 'Bb', octave: 2, position: 1,    accidental: 'flat'  }, // B line
    { name: 'Eb', octave: 3, position: 2.5,  accidental: 'flat'  }, // E space
    { name: 'Ab', octave: 2, position: 0.5,  accidental: 'flat'  }, // A space
    { name: 'Db', octave: 3, position: 2,    accidental: 'flat'  }, // D line
    { name: 'Gb', octave: 3, position: 3.5,  accidental: 'flat'  }, // G space
  ],
};

// ─── NOTE NAMES ──────────────────────────────────────────────────────────────

export const NOTE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Only the 5 real black keys, no enharmonic duplicates
export const ACCIDENTAL_NOTES = {
  sharps: ['F#', 'C#', 'G#', 'D#', 'A#'],
  flats: ['Bb', 'Eb', 'Ab', 'Db', 'Gb'],
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