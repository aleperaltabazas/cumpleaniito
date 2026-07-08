import { CSSProperties, ReactNode, useEffect, useRef } from 'react'
import { motion, useAnimate } from 'framer-motion'

interface WizBtnProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  primary?: boolean
  style?: CSSProperties
}

export default function WizBtn({ children, onClick, disabled, primary, style }: WizBtnProps) {
  const [scope, animate] = useAnimate<HTMLButtonElement>()
  const prevDisabled = useRef(disabled)

  useEffect(() => {
    if (prevDisabled.current && !disabled && scope.current) {
      animate(
        scope.current,
        { scale: [1, 1.1, 1], boxShadow: ['0 2px 0 rgba(0,0,0,.3)', '0 0 22px rgba(232,112,58,.75)', '0 2px 0 rgba(0,0,0,.3)'] },
        { duration: 0.5, ease: 'easeOut' }
      )
    }
    prevDisabled.current = disabled
  }, [disabled, animate, scope])

  return (
    <motion.button
      ref={scope}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { y: -2, boxShadow: '0 4px 14px rgba(232,112,58,.45)' }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 14,
        letterSpacing: '.04em',
        padding: '11px 22px',
        borderRadius: 6,
        border: '1px solid #6b5a2e',
        background: primary
          ? 'linear-gradient(180deg, var(--ember), #a6431b)'
          : 'linear-gradient(180deg, #3a2e5c, #211a3a)',
        color: primary ? '#fff6e4' : 'var(--gold-bright)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        boxShadow: '0 2px 0 rgba(0,0,0,.3)',
        outline: 'none',
        ...style,
      }}
    >
      {children}
    </motion.button>
  )
}
