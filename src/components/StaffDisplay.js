import { View, StyleSheet } from 'react-native';
import Svg, { Line, Ellipse, Rect, Text as SvgText } from 'react-native-svg';

const STAFF_LINES = 5;
const LINE_SPACING = 18;
const STAFF_TOP = 50;
const NOTE_RADIUS_X = 10;
const NOTE_RADIUS_Y = 8;
const CLEF_X = 20;
const NOTE_X = 180;

export default function StaffDisplay({ note, clef = 'treble', small = false }) {
  const staffWidth = small ? 160 : 320;
  const staffHeight = small ? 80 : 160;
  const scale = small ? 0.5 : 1;

  const SCALED_STAFF_TOP = STAFF_TOP * scale;
  const SCALED_LINE_SPACING = LINE_SPACING * scale;
  const SCALED_NOTE_R_X = NOTE_RADIUS_X * scale;
  const SCALED_NOTE_R_Y = NOTE_RADIUS_Y * scale;
  const SCALED_CLEF_X = CLEF_X * scale;
  const SCALED_NOTE_X = NOTE_X * scale;

  const getNoteY = (position) => {
    return SCALED_STAFF_TOP + (4 - position) * SCALED_LINE_SPACING;
  };

  const renderStaffLines = () => {
    return Array.from({ length: STAFF_LINES }).map((_, i) => (
      <Line
        key={i}
        x1={SCALED_CLEF_X + 20}
        y1={SCALED_STAFF_TOP + i * SCALED_LINE_SPACING}
        x2={staffWidth - 5}
        y2={SCALED_STAFF_TOP + i * SCALED_LINE_SPACING}
        stroke="#1a1a1a"
        strokeWidth={small ? 0.75 : 1.5}
      />
    ));
  };

  const renderLedgerLines = (position) => {
    const lines = [];
    const ledgerWidth = SCALED_NOTE_R_X * 2.8;

    for (let l = -1; l >= Math.floor(position); l--) {
      if (l % 1 === 0) {
        const y = getNoteY(l);
        lines.push(
          <Line
            key={`ledger-below-${l}`}
            x1={SCALED_NOTE_X - ledgerWidth / 2}
            y1={y}
            x2={SCALED_NOTE_X + ledgerWidth / 2}
            y2={y}
            stroke="#1a1a1a"
            strokeWidth={small ? 0.75 : 1.5}
          />
        );
      }
    }

    for (let l = 5; l <= Math.ceil(position); l++) {
      if (l % 1 === 0) {
        const y = getNoteY(l);
        lines.push(
          <Line
            key={`ledger-above-${l}`}
            x1={SCALED_NOTE_X - ledgerWidth / 2}
            y1={y}
            x2={SCALED_NOTE_X + ledgerWidth / 2}
            y2={y}
            stroke="#1a1a1a"
            strokeWidth={small ? 0.75 : 1.5}
          />
        );
      }
    }

    return lines;
  };

  const renderNote = (position) => {
    const noteY = getNoteY(position);
    const stemDir = position < 2 ? -1 : 1;
    const stemLen = SCALED_LINE_SPACING * 3.5;

    return (
      <>
        {/* Note head */}
        <Ellipse
          cx={SCALED_NOTE_X}
          cy={noteY}
          rx={SCALED_NOTE_R_X}
          ry={SCALED_NOTE_R_Y}
          fill="#1a1a1a"
          transform={`rotate(-15, ${SCALED_NOTE_X}, ${noteY})`}
        />

        {/* Stem */}
        <Line
          x1={stemDir === -1 ? SCALED_NOTE_X + SCALED_NOTE_R_X - 1 : SCALED_NOTE_X - SCALED_NOTE_R_X + 1}
          y1={noteY}
          x2={stemDir === -1 ? SCALED_NOTE_X + SCALED_NOTE_R_X - 1 : SCALED_NOTE_X - SCALED_NOTE_R_X + 1}
          y2={noteY + stemDir * stemLen}
          stroke="#1a1a1a"
          strokeWidth={small ? 0.9 : 1.8}
        />

        {/* Accidental */}
        {note?.accidental === 'sharp' && (
          <SvgText
            x={SCALED_NOTE_X - SCALED_NOTE_R_X * 3}
            y={noteY + 7 * scale}
            fontSize={small ? 11 : 20}
            fill="#1a1a1a"
          >
            ♯
          </SvgText>
        )}
        {note?.accidental === 'flat' && (
          <SvgText
            x={SCALED_NOTE_X - SCALED_NOTE_R_X * 3}
            y={noteY + 7 * scale}
            fontSize={small ? 11 : 20}
            fill="#1a1a1a"
          >
            ♭
          </SvgText>
        )}
      </>
    );
  };

  const renderClef = () => {
    if (clef === 'treble') {
      return (
        <SvgText
          x={SCALED_CLEF_X}
          y={SCALED_STAFF_TOP + 52 * scale}
          fontSize={small ? 44 : 88}
          fill="#1a1a1a"
        >
          𝄞
        </SvgText>
      );
    } else {
      return (
        <SvgText
          x={SCALED_CLEF_X}
          y={SCALED_STAFF_TOP + 34 * scale}
          fontSize={small ? 36 : 72}
          fill="#1a1a1a"
        >
          𝄢
        </SvgText>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Svg width={staffWidth} height={staffHeight}>
        {renderStaffLines()}
        {note && renderLedgerLines(note.position)}
        {renderClef()}
        {note && renderNote(note.position)}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
});