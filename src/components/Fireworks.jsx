import { useEffect, useRef } from 'react'

const COLORS = ['#f0c95c', '#e8703a', '#c9a227', '#f4e9cc', '#e0a15a']

function spawnBurst(particles, x, y) {
  const count = 34
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2
    const speed = 2 + Math.random() * 3.2
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.012 + Math.random() * 0.012,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 1.5 + Math.random() * 1.8,
    })
  }
}

export default function Fireworks() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let particles = []
    let running = true
    let frameId = null

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.02
        p.life -= p.decay
      })
      particles = particles.filter(p => p.life > 0)
      particles.forEach(p => {
        ctx.globalAlpha = Math.max(p.life, 0)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      if (running || particles.length > 0) {
        frameId = requestAnimationFrame(tick)
      }
    }
    tick()

    let bursts = 0
    const maxBursts = 8
    const burstTimer = setInterval(() => {
      const x = canvas.width * 0.15 + Math.random() * canvas.width * 0.7
      const y = canvas.height * 0.1 + Math.random() * canvas.height * 0.4
      spawnBurst(particles, x, y)
      bursts++
      if (bursts >= maxBursts) {
        clearInterval(burstTimer)
        running = false
      }
    }, 450)

    return () => {
      window.removeEventListener('resize', resize)
      clearInterval(burstTimer)
      running = false
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}
    />
  )
}
