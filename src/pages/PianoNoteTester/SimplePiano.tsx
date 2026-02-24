import { useEffect } from 'react'

interface SimplePianoProps {
  onNoteClick: (note: string) => void
  disabled?: boolean
  showNotes?: boolean
}

export function SimplePiano({
  onNoteClick,
  disabled = false,
  showNotes = false,
}: SimplePianoProps) {
  const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  const blackKeys = [
    { note: 'C#', position: 0 },
    { note: 'D#', position: 1 },
    { note: 'F#', position: 3 },
    { note: 'G#', position: 4 },
    { note: 'A#', position: 5 },
  ]

  // Keyboard mapping: QWERTY top rows following piano layout
  const keyboardMap: Record<string, string> = {
    a: 'C',
    w: 'C#',
    s: 'D',
    e: 'D#',
    d: 'E',
    f: 'F',
    r: 'F#',
    g: 'G',
    t: 'G#',
    h: 'A',
    y: 'A#',
    j: 'B',
  }

  // Reverse mapping for display
  const noteToKey: Record<string, string> = {
    C: 'A',
    'C#': 'W',
    D: 'S',
    'D#': 'E',
    E: 'D',
    F: 'F',
    'F#': 'R',
    G: 'G',
    'G#': 'T',
    A: 'H',
    'A#': 'Y',
    B: 'J',
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return
      const key = e.key.toLowerCase()
      const note = keyboardMap[key]
      if (note) {
        e.preventDefault()
        onNoteClick(note)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [disabled, onNoteClick])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        overflowX: 'auto',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          minWidth: 'fit-content',
        }}
      >
        {/* White keys */}
        {whiteKeys.map((note) => (
          <button
            key={note}
            onClick={() => !disabled && onNoteClick(note)}
            disabled={disabled}
            style={{
              width: '60px',
              height: '200px',
              backgroundColor: disabled ? '#f3f2f1' : 'white',
              border: '2px solid #0b0c0c',
              borderRadius: '0 0 8px 8px',
              fontSize: '20px',
              fontWeight: 700,
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.1s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: '15px',
              gap: '8px',
              opacity: disabled ? 0.6 : 1,
              boxShadow: disabled
                ? 'none'
                : '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 -4px 0 rgba(0, 0, 0, 0.1)',
              position: 'relative',
              zIndex: 1,
            }}
            onMouseDown={(e) => {
              if (!disabled) {
                e.currentTarget.style.transform = 'translateY(2px)'
                e.currentTarget.style.boxShadow = '0 2px 3px rgba(0, 0, 0, 0.1)'
              }
            }}
            onMouseUp={(e) => {
              if (!disabled) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow =
                  '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 -4px 0 rgba(0, 0, 0, 0.1)'
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow =
                  '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 -4px 0 rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            {showNotes && (
              <>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>{note}</div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#505a5f',
                    backgroundColor: '#f3f2f1',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #b1b4b6',
                  }}
                >
                  {noteToKey[note]}
                </div>
              </>
            )}
          </button>
        ))}

        {/* Black keys */}
        {blackKeys.map(({ note, position }) => (
          <button
            key={note}
            onClick={() => !disabled && onNoteClick(note)}
            disabled={disabled}
            style={{
              position: 'absolute',
              left: `${position * 60 + 42}px`,
              top: 0,
              width: '36px',
              height: '120px',
              backgroundColor: disabled ? '#505a5f' : '#0b0c0c',
              border: '2px solid #0b0c0c',
              borderRadius: '0 0 6px 6px',
              fontSize: '12px',
              fontWeight: 700,
              color: 'white',
              cursor: disabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: '8px',
              gap: '4px',
              opacity: disabled ? 0.6 : 1,
              boxShadow: disabled
                ? '0 2px 4px rgba(0, 0, 0, 0.3)'
                : '0 2px 6px rgba(0, 0, 0, 0.4)',
              zIndex: 2,
              transition: 'all 0.1s',
            }}
            onMouseDown={(e) => {
              if (!disabled) {
                e.currentTarget.style.transform = 'translateY(2px)'
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.4)'
              }
            }}
            onMouseUp={(e) => {
              if (!disabled) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.4)'
              }
            }}
          >
            {showNotes && (
              <>
                <div style={{ fontSize: '11px', fontWeight: 700 }}>{note}</div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '1px 4px',
                    borderRadius: '3px',
                  }}
                >
                  {noteToKey[note]}
                </div>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
