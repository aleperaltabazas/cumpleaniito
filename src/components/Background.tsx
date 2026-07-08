import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface ShootingStar {
  id: number
  top: number
  left: number
}

export default function Background() {
  const starsRef = useRef(null)
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])

  useEffect(() => {
    const container = starsRef.current
    if (!container) return
    const count = 90
    for (let i = 0; i < count; i++) {
      const s = document.createElement('div')
      s.className = 'star'
      const size = Math.random() * 2 + 1
      Object.assign(s.style, {
        width: size + 'px',
        height: size + 'px',
        left: Math.random() * 100 + 'vw',
        top: Math.random() * 70 + 'vh',
        animationDelay: (Math.random() * 4) + 's',
        animationDuration: (3 + Math.random() * 3) + 's',
      })
      container.appendChild(s)
    }
    return () => { container.innerHTML = '' }
  }, [])

  useEffect(() => {
    function scheduleNext(): ReturnType<typeof setTimeout> {
      const delay = 2500 + Math.random() * 4000
      return setTimeout(() => {
        const id = Date.now()
        setShootingStars(prev => [...prev, { id, top: Math.random() * 50, left: Math.random() * 70 }])
        setTimeout(() => setShootingStars(prev => prev.filter(s => s.id !== id)), 900)
        scheduleNext()
      }, delay)
    }
    const t = scheduleNext()
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <style>{`
        .star {
          position: absolute;
          background: var(--parchment);
          border-radius: 50%;
          opacity: 0.6;
          animation: twinkle 4s ease-in-out infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: .15; }
          50% { opacity: .9; }
        }
      `}</style>
      <div ref={starsRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
      {shootingStars.map(star => (
        <div
          key={star.id}
          style={{
            position: 'fixed',
            top: `${star.top}vh`,
            left: `${star.left}vw`,
            transform: 'rotate(28deg)',
            transformOrigin: 'left center',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1], opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.7, ease: 'easeOut', times: [0, 0.35, 1] }}
            style={{
              width: 110,
              height: 2,
              borderRadius: 2,
              background: 'linear-gradient(90deg, rgba(236,224,194,0.9), rgba(236,224,194,0))',
              transformOrigin: 'left center',
            }}
          />
        </div>
      ))}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, height: '26vh', zIndex: 0,
        background: 'linear-gradient(180deg, transparent, var(--void) 90%)',
        pointerEvents: 'none',
      }}>
        <svg viewBox="0 0 800 200" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <polygon points="0,200 0,120 120,40 220,110 320,60 430,130 520,70 640,120 720,90 800,140 800,200" fill="#0c0918" />
          <polygon points="0,200 0,160 150,100 280,150 400,110 560,160 680,130 800,170 800,200" fill="#150f28" />
        </svg>
      </div>
    </>
  )
}
