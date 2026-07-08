import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Runes from './Runes'
import WizBtn from './WizBtn'
import Step1Welcome from './Step1Welcome'
import Step2Terms from './Step2Terms'
import Step3Path from './Step3Path'
import Step4Casting from './Step4Casting'
import Step5Finish from './Step5Finish'
import LightningTransition from './LightningTransition'

const TOTAL = 5

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.18 } }),
}

const NEXT_LABELS: Record<number, string> = { 1: 'Comenzar ›', 5: 'Terminar ✦' }

export default function Wizard() {
  const [current, setCurrent] = useState(1)
  const [dir, setDir] = useState(1)
  const [agreed, setAgreed] = useState(false)
  const [path, setPath] = useState<string | null>(null)
  const [installDone, setInstallDone] = useState(false)
  const [lightning, setLightning] = useState(false)

  function canAdvance() {
    if (current === 2) return agreed
    if (current === 4) return installDone
    return true
  }

  function goNext() {
    if (!canAdvance()) return
    if (current === TOTAL) {
      setCurrent(1)
      setDir(-1)
      setAgreed(false)
      setPath(null)
      setInstallDone(false)
      return
    }
    // Step 4 → 5: intercept with lightning transition
    if (current === 4) {
      setLightning(true)
      return
    }
    setDir(1)
    setCurrent(c => c + 1)
  }

  function goBack() {
    if (current <= 1) return
    setDir(-1)
    setCurrent(c => c - 1)
  }

  // Called mid-flash: swap in step 5 while screen is white
  const handleReveal = useCallback(() => {
    setDir(1)
    setCurrent(5)
  }, [])

  // Called when overlay fully fades out
  const handleLightningDone = useCallback(() => {
    setLightning(false)
  }, [])

  const nextLabel = NEXT_LABELS[current] ?? 'Siguiente ›'

  return (
    <>
      <LightningTransition
        active={lightning}
        onReveal={handleReveal}
        onDone={handleLightningDone}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={installerStyle}
      >
        {/* Title bar */}
        <div style={titlebarStyle}>
          <h1 style={titleStyle}>El Mago de Cumpleaños</h1>
          <Runes current={current} />
        </div>

        {/* Step content */}
        <div style={{ minHeight: 340, padding: '34px 36px 20px', position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={current}
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {current === 1 && <Step1Welcome />}
              {current === 2 && <Step2Terms agreed={agreed} onAgreeChange={setAgreed} />}
              {current === 3 && <Step3Path selected={path} onSelect={setPath} />}
              {current === 4 && <Step4Casting onComplete={() => setInstallDone(true)} />}
              {current === 5 && <Step5Finish />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav buttons */}
        <div style={navStyle}>
          <WizBtn onClick={goBack} disabled={current === 1} style={{ visibility: current === 1 ? 'hidden' : 'visible' }}>
            ‹ Atrás
          </WizBtn>
          <div style={{ flex: 1 }} />
          <WizBtn primary onClick={goNext} disabled={!canAdvance() || lightning}>
            {nextLabel}
          </WizBtn>
        </div>
      </motion.div>
    </>
  )
}

const installerStyle = {
  position: 'relative' as const,
  zIndex: 2,
  width: 'min(640px, 92vw)',
  background: 'linear-gradient(180deg, #f4e9cc, #e6d5a8 55%, #d8c290)',
  borderRadius: 10,
  boxShadow: '0 0 0 1px #7a5f22, 0 0 0 6px #241c3d, 0 25px 60px rgba(0,0,0,.65), 0 0 90px rgba(201,162,39,.12)',
  color: 'var(--ink)',
  overflow: 'hidden',
}

const titlebarStyle = {
  background: 'linear-gradient(180deg, #241c3d, #150f28)',
  color: 'var(--gold-bright)',
  padding: '18px 24px 16px',
  borderBottom: '3px solid var(--gold)',
}

const titleStyle = {
  fontFamily: "'Cinzel Decorative', serif",
  fontSize: 'clamp(18px, 3.2vw, 24px)',
  letterSpacing: '.04em',
  margin: '0 0 12px',
  textAlign: 'center' as const,
  textShadow: '0 0 14px rgba(240,201,92,.45)',
  color: 'var(--gold-bright)',
}

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 30px 24px',
  borderTop: '1px solid #b79a4d',
  background: 'linear-gradient(180deg, #e3d1a2, #d8c290)',
}
