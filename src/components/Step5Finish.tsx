import { motion } from 'framer-motion'
import { COUSIN_NAME, COUSIN_AGE } from '../config'
import Fireworks from './Fireworks'

const container = {
  hidden: {},
  // delayChildren matches the white-fade window so elements emerge as screen clears
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.45 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 18 } },
}
const headingItem = {
  hidden: { opacity: 0, scale: 0.3 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 160, damping: 10 } },
}

export default function Step5Finish() {
  const ageText = COUSIN_AGE ? ` ${COUSIN_AGE}` : ''
  const nameText = COUSIN_NAME ? COUSIN_NAME : 'primo/a'

  return (
    <>
      <Fireworks />
      <motion.div variants={container} initial="hidden" animate="show" style={{ textAlign: 'center' }}>
        <motion.div
          variants={headingItem}
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 'clamp(26px, 5vw, 34px)',
            textAlign: 'center',
            color: 'var(--ink)',
            margin: '4px 0 12px',
            textShadow: '0 0 18px rgba(232,112,58,.25)',
          }}
        >
          🎂 ¡Feliz Cumpleaños{ageText ? `, ${nameText}!` : `!`} 🎂
        </motion.div>

        {ageText && (
          <motion.div
            variants={item}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(16px, 3vw, 20px)',
              color: '#8a6c1a',
              marginBottom: 16,
              letterSpacing: '.06em',
            }}
          >
            {ageText.trim()} años de leyenda
          </motion.div>
        )}

        <motion.p variants={item} style={body}>
          El hechizo está completo. Que este año te traiga buena fortuna, mejores historias y pastel en cantidades que harían envidiar a un dragón.
        </motion.p>

        <motion.p variants={item} style={{ ...body, fontStyle: 'italic' }}>
          — Con cariño, de tu primo favorito (palabras propias del instalador, no verificadas oficialmente)
        </motion.p>
      </motion.div>
    </>
  )
}

const body = {
  fontSize: 19,
  lineHeight: 1.55,
  margin: '0 0 14px',
  color: '#3a2e1c',
}
