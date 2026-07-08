import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const LABELS = ['I', 'II', 'III', 'IV', 'V']

function RuneItem({ label, step, current }: { label: string; step: number; current: number }) {
  const isDone = step < current
  const isActive = step === current
  const [bursting, setBursting] = useState(false)
  const prevCurrent = useRef(current)

  useEffect(() => {
    if (prevCurrent.current === step && current > step) {
      setBursting(true)
      const t = setTimeout(() => setBursting(false), 700)
      return () => clearTimeout(t)
    }
    prevCurrent.current = current
  }, [current, step])

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence>
        {bursting && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0.9 }}
            animate={{ scale: 2.8, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: -1,
              borderRadius: '50%',
              border: '2px solid var(--gold-bright)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
      <motion.div
        animate={
          isActive
            ? { boxShadow: '0 0 12px rgba(232,112,58,.7)', scale: 1.12 }
            : isDone
            ? { boxShadow: '0 0 6px rgba(201,162,39,.4)', scale: 1 }
            : { boxShadow: '0 0 0px rgba(0,0,0,0)', scale: 1 }
        }
        transition={{ duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
        style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          border: `2px solid ${isActive ? 'var(--gold-bright)' : isDone ? 'var(--gold)' : '#6b5a2e'}`,
          background: isActive
            ? 'radial-gradient(circle at 35% 30%, var(--ember), #7a3a12)'
            : isDone
            ? 'radial-gradient(circle at 35% 30%, var(--gold-bright), #8a6c1a)'
            : 'radial-gradient(circle at 35% 30%, #3a2e1a, #1c1608)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Cinzel', serif",
          fontSize: 12,
          color: isActive ? 'var(--gold-bright)' : isDone ? '#2a2016' : '#6b5a2e',
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        {label}
      </motion.div>
    </div>
  )
}

export default function Runes({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
      {LABELS.map((label, idx) => (
        <RuneItem key={idx + 1} label={label} step={idx + 1} current={current} />
      ))}
    </div>
  )
}
