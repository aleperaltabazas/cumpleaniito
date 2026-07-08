import { motion } from 'framer-motion'

const PATHS = [
  { value: 'quiet', glyph: '🍵', main: 'El Hogar Tranquilo', sub: 'Té, buena compañía, caos mínimo' },
  { value: 'feast', glyph: '🎉', main: 'El Festín Legendario', sub: 'Pastel apilado a alturas peligrosas' },
  { value: 'quest', glyph: '🗡️', main: 'La Épica Aventura', sub: 'Primero la aventura, los regalos después' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
}

interface Step3PathProps {
  selected: string | null
  onSelect: (value: string) => void
}

export default function Step3Path({ selected, onSelect }: Step3PathProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} style={eyebrow}>Personaliza tu celebración</motion.div>
      <motion.h2 variants={item} style={heading}>Elige Tu Camino</motion.h2>
      <motion.p variants={item} style={body}>
        Todo buen mago ofrece una elección que no cambia nada pero se siente importante. Elige una:
      </motion.p>
      <div style={{ display: 'grid', gap: 12 }}>
        {PATHS.map(path => {
          const isSelected = selected === path.value
          return (
            <motion.label
              key={path.value}
              variants={item}
              whileHover={{ y: -2, borderColor: 'var(--ember)' }}
              animate={isSelected
                ? { borderColor: 'var(--ember)', backgroundColor: '#f2e3bd', boxShadow: '0 0 0 2px rgba(232,112,58,.25)' }
                : { borderColor: '#b79a4d', backgroundColor: '#f8f0da', boxShadow: '0 0 0 0px rgba(232,112,58,0)' }
              }
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                border: '1px solid #b79a4d',
                background: '#f8f0da',
                borderRadius: 8,
                padding: '12px 16px',
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="path"
                value={path.value}
                checked={isSelected}
                onChange={() => onSelect(path.value)}
                style={{ accentColor: 'var(--ember)', width: 16, height: 16 }}
              />
              <span style={{ fontSize: 22, width: 28, textAlign: 'center' }}>{path.glyph}</span>
              <span>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: 15, display: 'block', color: 'var(--ink)' }}>
                  {path.main}
                </span>
                <span style={{ fontSize: 14, color: '#6b5a3e', display: 'block' }}>
                  {path.sub}
                </span>
              </span>
            </motion.label>
          )
        })}
      </div>
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
const body = {
  fontSize: 19,
  lineHeight: 1.55,
  margin: '0 0 14px',
  color: '#3a2e1c',
}
