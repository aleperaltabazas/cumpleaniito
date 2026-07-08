import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const MESSAGES = [
  'Preparando la incantación…',
  'Convocando las velas…',
  'Alineando los astros…',
  'Puliendo la sabiduría (un año de ella)…',
  'Desenredando los serpentines…',
  'Despertando el pastel…',
  '¡Finalizando el hechizo…!',
]

export default function Step4Casting({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)
  const [done, setDone] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    let pct = 0
    let msg = 0
    const interval = setInterval(() => {
      pct += Math.random() * 14 + 6
      if (pct >= 100) {
        pct = 100
        clearInterval(interval)
        setDone(true)
        setProgress(100)
        onCompleteRef.current()
      } else {
        msg = Math.min(msg + 1, MESSAGES.length - 1)
        setMsgIndex(msg)
        setProgress(pct)
      }
    }, 420)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={eyebrow}>Por favor espera</div>
      <h2 style={heading}>Lanzando el Hechizo</h2>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '22px 0 4px' }}>
        {done ? (
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            style={{ fontSize: 46, lineHeight: 1 }}
          >
            ✨
          </motion.div>
        ) : (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              border: '3px solid #d8c8a0',
              borderTopColor: 'var(--ember)',
            }}
          />
        )}
      </div>

      <motion.div
        key={msgIndex}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3 }}
        style={statusLine}
      >
        {done ? '¡Hechizo completado!' : MESSAGES[msgIndex]}
      </motion.div>

      <div style={barTrack}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={barFill}
        />
      </div>
      <div style={barPct}>{Math.round(progress)}%</div>
    </motion.div>
  )
}

const eyebrow = {
  fontFamily: "'Cinzel', serif",
  fontSize: 12,
  letterSpacing: '.18em',
  textTransform: 'uppercase',
  color: '#8a6c1a',
  margin: '0 0 6px',
}
const heading = {
  fontFamily: "'Cinzel', serif",
  fontSize: 'clamp(22px, 4vw, 28px)',
  margin: '0 0 14px',
  color: 'var(--ink)',
}
const statusLine = {
  fontFamily: "'Cinzel', serif",
  fontSize: 14,
  letterSpacing: '.03em',
  color: '#6b5a2e',
  margin: '6px 0 10px',
  minHeight: 18,
  textAlign: 'center',
}
const barTrack = {
  height: 20,
  borderRadius: 10,
  background: '#d8c8a0',
  border: '1px solid #b79a4d',
  overflow: 'hidden',
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,.25)',
}
const barFill = {
  height: '100%',
  borderRadius: 10,
  background: 'linear-gradient(90deg, var(--ember), var(--gold-bright))',
  boxShadow: '0 0 12px rgba(232,112,58,.6)',
}
const barPct = {
  textAlign: 'right',
  fontFamily: "'Cinzel', serif",
  fontSize: 13,
  color: '#6b5a2e',
  marginTop: 6,
}
