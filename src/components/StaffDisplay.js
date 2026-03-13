import { View, StyleSheet } from 'react-native';
import Svg, { Line, Ellipse, Rect, Text as SvgText } from 'react-native-svg';

const STAFF_LINES = 5;
const LINE_SPACING = 18;
const STAFF_TOP = 50;
const NOTE_RADIUS_X = 10;
const NOTE_RADIUS_Y = 8;
const CLEF_X = 20;
const NOTE_X = 180;

export default function StaffDisplay({ note, clef = 'treble' }) {
  const staffWidth = 320;
  const staffHeight = 160;

  const getNoteY = (position) => {
    return STAFF_TOP + (4 - position) * LINE_SPACING;
  };

  const renderStaffLines = () => {
    return Array.from({ length: STAFF_LINES }).map((_, i) => (
      <Line
        key={i}
        x1={CLEF_X + 40}
        y1={STAFF_TOP + i * LINE_SPACING}
        x2={staffWidth - 10}
        y2={STAFF_TOP + i * LINE_SPACING}
        stroke="#1a1a1a"
        strokeWidth="1.5"
      />
    ));
  };

  const renderLedgerLines = (position) => {
    const lines = [];
    const ledgerWidth = NOTE_RADIUS_X * 2.8;

    // Below staff
    for (let l = -1; l >= Math.floor(position); l--) {
      if (l % 1 === 0) {
        const y = getNoteY(l);
        lines.push(
          <Line
            key={`ledger-below-${l}`}
            x1={NOTE_X - ledgerWidth / 2}
            y1={y}
            x2={NOTE_X + ledgerWidth / 2}
            y2={y}
            stroke="#1a1a1a"
            strokeWidth="1.5"
          />
        );
      }
    }

    // Above staff
    for (let l = 5; l <= Math.ceil(position); l++) {
      if (l % 1 === 0) {
        const y = getNoteY(l);
        lines.push(
          <Line
            key={`ledger-above-${l}`}
            x1={NOTE_X - ledgerWidth / 2}
            y1={y}
            x2={NOTE_X + ledgerWidth / 2}
            y2={y}
            stroke="#1a1a1a"
            strokeWidth="1.5"
          />
        );
      }
    }

    return lines;
  };

  const renderNote = (position) => {
    const noteY = getNoteY(position);
    const stemDir = position < 2 ? -1 : 1;
    const stemLen = LINE_SPACING * 3.5;

    return (
      <>
        {/* Note head */}
        <Ellipse
          cx={NOTE_X}
          cy={noteY}
          rx={NOTE_RADIUS_X}
          ry={NOTE_RADIUS_Y}
          fill="#1a1a1a"
          transform={`rotate(-15, ${NOTE_X}, ${noteY})`}
        />

        {/* Stem */}
        <Line
          x1={stemDir === -1 ? NOTE_X + NOTE_RADIUS_X - 1 : NOTE_X - NOTE_RADIUS_X + 1}
          y1={noteY}
          x2={stemDir === -1 ? NOTE_X + NOTE_RADIUS_X - 1 : NOTE_X - NOTE_RADIUS_X + 1}
          y2={noteY + stemDir * stemLen}
          stroke="#1a1a1a"
          strokeWidth="1.8"
        />

        {/* Accidental */}
        {note?.accidental === 'sharp' && (
          <SvgText
            x={NOTE_X - NOTE_RADIUS_X * 3}
            y={noteY + 7}
            fontSize="20"
            fill="#1a1a1a"
          >
            ♯
          </SvgText>
        )}
        {note?.accidental === 'flat' && (
          <SvgText
            x={NOTE_X - NOTE_RADIUS_X * 3}
            y={noteY + 7}
            fontSize="20"
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
          x={CLEF_X}
          y={STAFF_TOP + 52}
          fontSize="88"
          fill="#1a1a1a"
        >
          𝄞
        </SvgText>
      );
    } else {
      return (
        <SvgText
          x={CLEF_X}
          y={STAFF_TOP + 34}
          fontSize="72"
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