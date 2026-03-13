export const TREBLE_NOTES = {
  beginner: [
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
  intermediate: [
    { name: 'C', octave: 4, position: -1 },
    { name: 'D', octave: 4, position: -0.5 },
    { name: 'G', octave: 5, position: 4.5 },
    { name: 'A', octave: 5, position: 5 },
    { name: 'B', octave: 5, position: 5.5 },
    { name: 'C', octave: 6, position: 6 },
  ],
  advanced: [
    { name: 'Bb', octave: 4, position: 1.5, accidental: 'flat' },
    { name: 'Eb', octave: 5, position: 2.5, accidental: 'flat' },
    { name: 'F#', octave: 4, position: 0.5, accidental: 'sharp' },
    { name: 'C#', octave: 5, position: 2.5, accidental: 'sharp' },
    { name: 'Ab', octave: 5, position: 4.5, accidental: 'flat' },
  ],
};

export const BASS_NOTES = {
  beginner: [
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
  intermediate: [
    { name: 'F', octave: 2, position: -0.5 },
    { name: 'E', octave: 2, position: -1 },
    { name: 'B', octave: 3, position: 4.5 },
    { name: 'C', octave: 4, position: 5 },
    { name: 'D', octave: 4, position: 5.5 },
  ],
  advanced: [
    { name: 'Bb', octave: 2, position: 1, accidental: 'flat' },
    { name: 'Eb', octave: 3, position: 2.5, accidental: 'flat' },
    { name: 'F#', octave: 3, position: 3, accidental: 'sharp' },
    { name: 'Ab', octave: 3, position: 4.5, accidental: 'flat' },
  ],
};

export const NOTE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];