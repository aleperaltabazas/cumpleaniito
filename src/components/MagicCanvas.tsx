import { RefObject, useEffect, useRef } from 'react'

const SPARK_COLORS = ['#f0c95c', '#ffffff', '#e8703a', '#ffd700', '#fff6e4']
const EMBER_COLORS = ['#e8703a', '#c9a227', '#f0c95c', '#ff8c42']
const LIGHTNING_COLORS = ['#f0c95c', '#c0e0ff', '#ffffff']

interface Spark {
  x: number; y: number; vx: number; vy: number
  life: number; decay: number; size: number; color: string
}

interface Ember {
  x: number; y: number; vx: number; vy: number
  life: number; decay: number; size: number; color: string
}

interface Bolt {
  points: [number, number][]
  life: number; color: string
}

function buildBolt(x1: number, y1: number, x2: number, y2: number, segments: number): [number, number][] {
  const pts: [number, number][] = [[x1, y1]]
  for (let i = 1; i < segments; i++) {
    const t = i / segments
    const bx = x1 + (x2 - x1) * t
    const by = y1 + (y2 - y1) * t
    const sway = (Math.random() - 0.5) * 28 * Math.sin(Math.PI * t)
    pts.push([bx + sway, by + sway * 0.25])
  }
  pts.push([x2, y2])
  return pts
}

function spawnEffects(
  canvas: HTMLCanvasElement,
  barEl: HTMLDivElement,
  progress: number,
  sparks: Spark[],
  embers: Ember[],
  bolts: Bolt[],
  multiplier = 1
) {
  const cr = canvas.getBoundingClientRect()
  const br = barEl.getBoundingClientRect()
  const edgeX = br.left - cr.left + (progress / 100) * br.width
  const edgeY = br.top - cr.top + br.height / 2

  const sparkCount = Math.round(20 * multiplier)
  for (let i = 0; i < sparkCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 2.5 + Math.random() * 5.5
    sparks.push({
      x: edgeX, y: edgeY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.2,
      life: 1,
      decay: 0.018 + Math.random() * 0.025,
      size: 1.2 + Math.random() * 2.5,
      color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
    })
  }

  const emberCount = Math.round(12 * multiplier)
  for (let i = 0; i < emberCount; i++) {
    embers.push({
      x: edgeX + (Math.random() - 0.5) * 18,
      y: edgeY,
      vx: (Math.random() - 0.5) * 1.4,
      vy: -(1.8 + Math.random() * 3),
      life: 1,
      decay: 0.01 + Math.random() * 0.014,
      size: 2.5 + Math.random() * 3.5,
      color: EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
    })
  }

  const boltCount = Math.round(2 * multiplier)
  for (let i = 0; i < boltCount; i++) {
    const tx = edgeX + (Math.random() - 0.5) * 70
    const ty = edgeY - 35 - Math.random() * 55
    bolts.push({
      points: buildBolt(edgeX, edgeY, tx, ty, 8),
      life: 1,
      color: LIGHTNING_COLORS[Math.floor(Math.random() * LIGHTNING_COLORS.length)],
    })
  }
}

export default function MagicCanvas({
  progress,
  done,
  barTrackRef,
}: {
  progress: number
  done: boolean
  barTrackRef: RefObject<HTMLDivElement | null>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparks = useRef<Spark[]>([])
  const embers = useRef<Ember[]>([])
  const bolts = useRef<Bolt[]>([])
  const prevProgress = useRef(0)

  // Keep canvas buffer in sync with rendered size
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const sync = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  // Spawn on progress tick
  useEffect(() => {
    const canvas = canvasRef.current
    const bar = barTrackRef.current
    if (!canvas || !bar) return

    if (progress > prevProgress.current && progress > 0 && progress < 100) {
      spawnEffects(canvas, bar, progress, sparks.current, embers.current, bolts.current)
    }
    if (progress === 100 && prevProgress.current < 100) {
      // Triple burst for the finish
      for (let b = 0; b < 3; b++) {
        setTimeout(() => {
          spawnEffects(canvas, bar, 100, sparks.current, embers.current, bolts.current, 2)
        }, b * 160)
      }
    }
    prevProgress.current = progress
  }, [progress, barTrackRef])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let id: number

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Sparks
      sparks.current = sparks.current.filter(s => {
        s.x += s.vx; s.y += s.vy
        s.vy += 0.18
        s.life -= s.decay
        if (s.life <= 0) return false
        ctx.globalAlpha = s.life
        ctx.fillStyle = s.color
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2)
        ctx.fill()
        return true
      })

      // Embers
      embers.current = embers.current.filter(e => {
        e.x += e.vx; e.y += e.vy
        e.vy *= 0.97
        e.vx += (Math.random() - 0.5) * 0.18
        e.life -= e.decay
        if (e.life <= 0) return false
        ctx.globalAlpha = e.life * 0.9
        ctx.fillStyle = e.color
        ctx.beginPath()
        ctx.ellipse(e.x, e.y, e.size * 0.55 * e.life, e.size * e.life, 0, 0, Math.PI * 2)
        ctx.fill()
        return true
      })

      // Lightning bolts
      bolts.current = bolts.current.filter(b => {
        b.life -= 0.08
        if (b.life <= 0) return false
        ctx.globalAlpha = b.life * 0.9
        // Glow pass
        ctx.beginPath()
        b.points.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
        ctx.strokeStyle = b.color === '#c0e0ff' ? 'rgba(160,210,255,0.25)' : 'rgba(240,200,80,0.25)'
        ctx.lineWidth = 7 * b.life
        ctx.stroke()
        // Core pass
        ctx.beginPath()
        b.points.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
        ctx.strokeStyle = b.color
        ctx.lineWidth = 1.5 * b.life
        ctx.stroke()
        return true
      })

      ctx.globalAlpha = 1
      id = requestAnimationFrame(tick)
    }

    tick()
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  )
}
