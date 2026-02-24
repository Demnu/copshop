declare module 'react-piano' {
  export interface NoteRange {
    first: number
    last: number
  }

  export interface PianoProps {
    noteRange: NoteRange
    playNote: (midiNumber: number) => void
    stopNote: (midiNumber: number) => void
    width?: number
    keyboardShortcuts?: any
    disabled?: boolean
    className?: string
  }

  export const Piano: React.FC<PianoProps>

  export const MidiNumbers: {
    fromNote: (note: string) => number
    toNote: (midiNumber: number) => string
    NATURAL_MIDI_NUMBERS: number[]
  }

  export const KeyboardShortcuts: {
    create: (config: {
      firstNote: number
      lastNote: number
      keyboardConfig: any
    }) => any
    HOME_ROW: any
    BOTTOM_ROW: any
    QWERTY_ROW: any
  }
}

declare module 'react-piano/dist/styles.css'
