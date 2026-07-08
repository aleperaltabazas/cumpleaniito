import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
}

interface Step2TermsProps {
  agreed: boolean
  onAgreeChange: (value: boolean) => void
}

export default function Step2Terms({ agreed, onAgreeChange }: Step2TermsProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} style={eyebrow}>Antes de proceder</motion.div>
      <motion.h2 variants={item} style={heading}>Términos del Encantamiento</motion.h2>
      <motion.div variants={item} style={scrollBox}>
        Al continuar, reconoces y aceptas lo siguiente:<br /><br />
        1. Un (1) año de sabiduría será otorgado al festejado, lo haya pedido o no.<br /><br />
        2. El pastel es obligatorio. Las velas son innegociables. Los deseos formulados al apagarlas son vinculantes bajo la ley ancestral.<br /><br />
        3. Cualquier parecido con Gandalf, magos, o extraños errantes encapuchados de gris que aparecen sin invitación pero están secretamente encantados de verte, es completamente intencional.<br /><br />
        4. Este instalador puede expresar afecto excesivo por el destinatario. No hay forma de desactivar esta función.
      </motion.div>
      <motion.label variants={item} style={agreeRow}>
        <motion.input
          type="checkbox"
          checked={agreed}
          onChange={e => onAgreeChange(e.target.checked)}
          whileTap={{ scale: 1.2 }}
          style={{ width: 18, height: 18, accentColor: 'var(--ember)', cursor: 'pointer' }}
        />
        <span>Acepto crecer un año más sabio</span>
      </motion.label>
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
const scrollBox = {
  background: '#f8f0da',
  border: '1px solid #b79a4d',
  borderRadius: 6,
  padding: '14px 16px',
  height: 130,
  overflowY: 'auto',
  fontSize: 16,
  lineHeight: 1.55,
  color: '#4a3c22',
  boxShadow: 'inset 0 0 10px rgba(0,0,0,.08)',
  marginBottom: 16,
}
const agreeRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontFamily: "'Cinzel', serif",
  fontSize: 14,
  letterSpacing: '.02em',
  color: 'var(--ink)',
  cursor: 'pointer',
}
