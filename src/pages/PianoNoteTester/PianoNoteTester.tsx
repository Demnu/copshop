import { useState, useEffect } from 'react'
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano'
import 'react-piano/dist/styles.css'
import { GovUKButton } from '@/components/govuk/GovUKButton'
import { GovUKInput } from '@/components/govuk/GovUKInput'
import { GovUKBody } from '@/components/govuk/GovUKBody'
import { GovUKSectionHeading } from '@/components/govuk/GovUKSectionHeading'
import { GovUKTag } from '@/components/govuk/GovUKTag'
import { PageContainer } from '@/components/PageContainer'
import { PageHeader } from '@/components/PageHeader'

// C Major scale notes (no flats)
const C_MAJOR_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

// Map note names to MIDI numbers (using middle octave C4-B4)
const NOTE_TO_MIDI: Record<string, number> = {
  C: 60, // C4
  D: 62, // D4
  E: 64, // E4
  F: 65, // F4
  G: 67, // G4
  A: 69, // A4
  B: 71, // B4
}

type GameState = 'setup' | 'playing' | 'won' | 'lost' | 'finished'

interface Game {
  timerDuration: number
  totalRounds: number
  state: GameState
  targetNote: string
  timeRemaining: number
  score: number
  currentRound: number
  pianoWidth: number
}

export function PianoNoteTester() {
  const [game, setGame] = useState<Game>({
    timerDuration: 10,
    totalRounds: 5,
    state: 'setup',
    targetNote: '',
    timeRemaining: 0,
    score: 0,
    currentRound: 0,
    pianoWidth: 800,
  })

  // Piano range (2 octaves from C4 to C6)
  const firstNote = MidiNumbers.fromNote('c4')
  const lastNote = MidiNumbers.fromNote('c6')

  // Handle responsive piano width
  useEffect(() => {
    const updatePianoWidth = () => {
      if (typeof window !== 'undefined') {
        setGame((prev) => ({
          ...prev,
          pianoWidth: Math.min(window.innerWidth - 40, 800),
        }))
      }
    }

    updatePianoWidth()
    window.addEventListener('resize', updatePianoWidth)
    return () => window.removeEventListener('resize', updatePianoWidth)
  }, [])

  const pickRandomNote = () => {
    const randomIndex = Math.floor(Math.random() * C_MAJOR_NOTES.length)
    return C_MAJOR_NOTES[randomIndex]
  }

  const startGame = () => {
    const note = pickRandomNote()
    setGame((prev) => ({
      ...prev,
      targetNote: note,
      timeRemaining: prev.timerDuration,
      score: 0,
      currentRound: 1,
      state: 'playing',
    }))
  }

  const resetGame = () => {
    setGame((prev) => ({
      ...prev,
      state: 'setup',
      targetNote: '',
      timeRemaining: 0,
      score: 0,
      currentRound: 0,
    }))
  }

  const nextRound = () => {
    if (game.currentRound < game.totalRounds) {
      const note = pickRandomNote()
      setGame((prev) => ({
        ...prev,
        targetNote: note,
        timeRemaining: prev.timerDuration,
        currentRound: prev.currentRound + 1,
        state: 'playing',
      }))
    } else {
      setGame((prev) => ({ ...prev, state: 'finished' }))
    }
  }

  const onPlayNote = (midiNumber: number) => {
    if (game.state !== 'playing') return

    // Find which note was played
    const playedNote = Object.entries(NOTE_TO_MIDI).find(
      ([_, midi]) => midi === midiNumber || midi + 12 === midiNumber, // Allow any octave
    )?.[0]

    if (playedNote === game.targetNote) {
      setGame((prev) => ({
        ...prev,
        score: prev.score + 1,
        state: 'won',
      }))
    }
  }

  // Timer countdown
  useEffect(() => {
    if (game.state === 'playing' && game.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setGame((prev) => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }))
      }, 1000)
      return () => clearTimeout(timer)
    } else if (game.state === 'playing' && game.timeRemaining === 0) {
      setGame((prev) => ({ ...prev, state: 'lost' }))
    }
  }, [game.state, game.timeRemaining])

  // Auto-advance to next round after win only
  useEffect(() => {
    if (game.state === 'won') {
      const timer = setTimeout(() => {
        nextRound()
      }, 2000) // Wait 2 seconds before next round
      return () => clearTimeout(timer)
    }
  }, [game.state])

  return (
    <PageContainer>
      <PageHeader title="Piano Note Tester" />

      <style>{`
        .piano-score-card {
          background: #f3f2f1;
          border: 3px solid #1d70b8;
          padding: 15px 20px;
          margin-bottom: 15px;
        }
        .piano-score-grid {
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }
        .piano-score-item {
          text-align: center;
        }
        .piano-score-number {
          font-size: 36px;
          font-weight: 700;
          line-height: 1;
          color: #1d70b8;
        }
        .piano-note-display {
          background: #fef9c3;
          border: 4px solid #fbbf24;
          padding: 20px;
          text-align: center;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 20px;
        }
        .piano-note-letter {
          font-size: 100px;
          font-weight: 900;
          line-height: 1;
          color: #78350f;
        }
        .piano-timer {
          display: inline-block;
          padding: 12px 24px;
          font-size: 32px;
          font-weight: 700;
          border-radius: 50px;
        }
        .piano-timer-normal {
          background: #fbbf24;
          color: #78350f;
        }
        .piano-timer-urgent {
          background: #d4351c;
          color: white;
          animation: pulse 1s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .piano-result-card {
          padding: 20px;
          text-align: center;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        .piano-result-green {
          background: #d1fae5;
          border: 4px solid #00703c;
        }
        .piano-result-red {
          background: #fee2e2;
          border: 4px solid #d4351c;
        }
        .piano-result-purple {
          background: #e9d5ff;
          border: 4px solid #4c2c92;
        }
        .piano-result-icon {
          font-size: 60px;
          line-height: 1;
        }
        .piano-result-score {
          font-size: 48px;
          font-weight: 900;
          line-height: 1;
        }
        .piano-result-content {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .piano-button-group {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 10px;
        }
        .piano-keyboard-container {
          background: #f3f2f1;
          border: 2px solid #505a5f;
          padding: 15px;
          overflow-x: auto;
        }
        @media (max-width: 640px) {
          .piano-note-letter { font-size: 80px; }
          .piano-timer { font-size: 24px; padding: 10px 20px; }
          .piano-score-number { font-size: 28px; }
          .piano-result-score { font-size: 36px; }
          .piano-result-icon { font-size: 40px; }
        }
      `}</style>

      <div>
        {/* Score Display */}
        {game.state !== 'setup' && game.state !== 'finished' && (
          <div className="piano-score-card">
            <div className="piano-score-grid">
              <div className="piano-score-item">
                <GovUKBody size="s" marginBottom={1}>
                  Round
                </GovUKBody>
                <div className="piano-score-number">
                  {game.currentRound}{' '}
                  <span style={{ fontSize: '20px', color: '#505a5f' }}>
                    / {game.totalRounds}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Setup Phase */}
        {game.state === 'setup' && (
          <div>
            <GovUKSectionHeading>Game Settings</GovUKSectionHeading>
            <div
              style={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              <div
                className="govuk-form-group"
                style={{ flex: '1', minWidth: '200px' }}
              >
                <label className="govuk-label govuk-label--s" htmlFor="rounds">
                  🎯 Rounds
                </label>
                <GovUKInput
                  type="number"
                  value={game.totalRounds}
                  onChange={(e) =>
                    setGame((prev) => ({
                      ...prev,
                      totalRounds: Math.max(1, parseInt(e.target.value) || 5),
                    }))
                  }
                  min={1}
                  max={20}
                  id="rounds"
                />
              </div>
              <div
                className="govuk-form-group"
                style={{ flex: '1', minWidth: '200px' }}
              >
                <label className="govuk-label govuk-label--s" htmlFor="timer">
                  ⏱️ Time (seconds)
                </label>
                <GovUKInput
                  type="number"
                  value={game.timerDuration}
                  onChange={(e) =>
                    setGame((prev) => ({
                      ...prev,
                      timerDuration: Math.max(
                        1,
                        parseInt(e.target.value) || 10,
                      ),
                    }))
                  }
                  min={1}
                  max={60}
                  id="timer"
                />
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <GovUKButton onClick={startGame}>▶️ Start Game</GovUKButton>
            </div>
          </div>
        )}

        {/* Playing Phase */}
        {game.state === 'playing' && (
          <div className="piano-note-display">
            <div className="piano-note-letter">{game.targetNote}</div>
            <div
              className={
                game.timeRemaining <= 3
                  ? 'piano-timer piano-timer-urgent'
                  : 'piano-timer piano-timer-normal'
              }
            >
              ⏱️ {game.timeRemaining}s
            </div>
          </div>
        )}

        {/* Won Phase */}
        {game.state === 'won' && (
          <div className="piano-result-card piano-result-green">
            <div className="piano-result-content">
              <div className="piano-result-icon">✅</div>
              <div
                className="piano-note-letter"
                style={{ fontSize: '60px', color: '#00703c' }}
              >
                {game.targetNote}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '20px',
                    color: '#00703c',
                    marginBottom: '4px',
                  }}
                >
                  Correct!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lost Phase */}
        {game.state === 'lost' && (
          <div>
            <div className="piano-result-card piano-result-red">
              <div className="piano-result-content">
                <div className="piano-result-icon">❌</div>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '20px',
                      color: '#d4351c',
                      marginBottom: '4px',
                    }}
                  >
                    Time's Up!
                  </div>
                  <GovUKBody size="s" marginBottom={0}>
                    Answer:{' '}
                    <strong style={{ fontSize: '32px' }}>
                      {game.targetNote}
                    </strong>
                  </GovUKBody>
                </div>
                <div>
                  <div
                    className="piano-result-score"
                    style={{ color: '#d4351c' }}
                  >
                    {game.score}/{game.currentRound}
                  </div>
                  <GovUKBody size="s" marginBottom={0}>
                    {Math.round((game.score / game.currentRound) * 100)}%
                  </GovUKBody>
                </div>
              </div>
            </div>
            <div className="piano-button-group">
              <GovUKButton onClick={startGame}>🔄 Try Again</GovUKButton>
              <GovUKButton onClick={resetGame} variant="secondary">
                ⚙️ Settings
              </GovUKButton>
            </div>
          </div>
        )}

        {/* Finished Phase */}
        {game.state === 'finished' && (
          <div>
            <div className="piano-result-card piano-result-purple">
              <div className="piano-result-content">
                <div className="piano-result-icon">
                  {game.score === game.totalRounds && '🏆'}
                  {game.score >= game.totalRounds * 0.8 &&
                    game.score < game.totalRounds &&
                    '⭐'}
                  {game.score >= game.totalRounds * 0.5 &&
                    game.score < game.totalRounds * 0.8 &&
                    '👍'}
                  {game.score < game.totalRounds * 0.5 && '💪'}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '20px',
                      color: '#4c2c92',
                      marginBottom: '4px',
                    }}
                  >
                    Game Complete!
                  </div>
                  <GovUKTag color="purple">
                    {game.score === game.totalRounds && 'Perfect!'}
                    {game.score >= game.totalRounds * 0.8 &&
                      game.score < game.totalRounds &&
                      'Great!'}
                    {game.score >= game.totalRounds * 0.5 &&
                      game.score < game.totalRounds * 0.8 &&
                      'Good!'}
                    {game.score < game.totalRounds * 0.5 && 'Keep Going!'}
                  </GovUKTag>
                </div>
                <div>
                  <div
                    className="piano-result-score"
                    style={{ color: '#4c2c92' }}
                  >
                    {game.score}
                    <span style={{ fontSize: '28px', color: '#505a5f' }}>
                      /{game.totalRounds}
                    </span>
                  </div>
                  <GovUKBody size="l" marginBottom={0}>
                    {Math.round((game.score / game.totalRounds) * 100)}%
                  </GovUKBody>
                </div>
              </div>
            </div>
            <div className="piano-button-group">
              <GovUKButton onClick={startGame}>🔄 Play Again</GovUKButton>
              <GovUKButton onClick={resetGame} variant="secondary">
                ⚙️ Settings
              </GovUKButton>
            </div>
          </div>
        )}

        {/* Piano Keyboard */}
        {(game.state === 'playing' ||
          game.state === 'won' ||
          game.state === 'lost') && (
          <div className="piano-keyboard-container">
            <div
              style={{
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '18px',
                marginBottom: '15px',
              }}
            >
              🎹 Tap a key
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                overflowX: 'auto',
                pointerEvents: game.state === 'playing' ? 'auto' : 'none',
                opacity: game.state === 'playing' ? 1 : 0.6,
              }}
            >
              <Piano
                key={`piano-${game.currentRound}-${game.state}`}
                noteRange={{ first: firstNote, last: lastNote }}
                playNote={onPlayNote}
                stopNote={() => {}}
                width={game.pianoWidth}
                disabled={game.state !== 'playing'}
                keyboardShortcuts={KeyboardShortcuts.create({
                  firstNote: firstNote,
                  lastNote: lastNote,
                  keyboardConfig: KeyboardShortcuts.HOME_ROW,
                })}
              />
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
