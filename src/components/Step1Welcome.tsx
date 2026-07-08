import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
}

export default function Step1Welcome() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <svg width="74" height="74" viewBox="0 0 100 100" fill="none">
          <motion.line
            x1="50" y1="90" x2="50" y2="10"
            stroke="#8a6c1a" strokeWidth="4" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          <motion.circle
            cx="50" cy="12" r="9" fill="#e8703a" opacity="0.9"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 14 }}
          />
          <motion.circle
            cx="50" cy="12" r="15" fill="none" stroke="#f0c95c" strokeWidth="1.5" opacity="0.6"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.6 }}
            transition={{ delay: 0.65, duration: 0.4 }}
          />
        </svg>
      </motion.div>

      <motion.div variants={item} style={eyebrow}>Bienvenido, viajero</motion.div>
      <motion.h2 variants={item} style={heading}>Un Ritual Te Aguarda</motion.h2>
      <motion.p variants={item} style={body}>
        En algún lugar, una vela cuenta uno más que ayer. Este mago te guiará a través del sagrado (y levemente burocrático) rito de desearle a tu primo un muy feliz cumpleaños.
      </motion.p>
      <motion.p variants={item} style={body}>
        Cinco breves pasos separan tu deseo de su consumación. ¿Aceptas la misión?
      </motion.p>
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
