import { motion } from 'framer-motion'

const LABELS = ['I', 'II', 'III', 'IV', 'V']

export default function Runes({ current }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
      {LABELS.map((label, idx) => {
        const step = idx + 1
        const isDone = step < current
        const isActive = step === current
        return (
          <motion.div
            key={step}
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
        )
      })}
    </div>
  )
}
