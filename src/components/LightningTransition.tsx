import { useEffect, useRef } from 'react'

// Midpoint displacement bolt — depth 6 → 64 segments
function generateBolt(
  x1: number, y1: number,
  x2: number, y2: number,
  depth: number
): [number, number][] {
  if (depth === 0) return [[x1, y1], [x2, y2]]
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * len * 0.45
  const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * len * 0.1
  return [
    ...generateBolt(x1, y1, midX, midY, depth - 1),
    ...generateBolt(midX, midY, x2, y2, depth - 1).slice(1),
  ]
}

function strokeBolt(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  width: number,
  color: string,
  alpha: number
) {
  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.lineJoin = 'round'
  ctx.beginPath()
  points.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
  ctx.stroke()
}

function drawFullBolt(
  ctx: CanvasRenderingContext2D,
  main: [number, number][],
  branches: [number, number][][],
  boltAlpha: number
) {
  // Main bolt — four passes (outer glow → core)
  strokeBolt(ctx, main, 50, 'rgba(80,120,255,0.06)', boltAlpha)
  strokeBolt(ctx, main, 22, 'rgba(140,190,255,0.22)', boltAlpha)
  strokeBolt(ctx, main, 8,  'rgba(210,235,255,0.7)', boltAlpha)
  strokeBolt(ctx, main, 2.5,'#ffffff', boltAlpha)

  // Branches
  branches.forEach(branch => {
    strokeBolt(ctx, branch, 10, 'rgba(140,190,255,0.18)', boltAlpha * 0.7)
    strokeBolt(ctx, branch, 3,  'rgba(210,235,255,0.6)', boltAlpha * 0.7)
    strokeBolt(ctx, branch, 1.2,'#ffffff', boltAlpha * 0.65)
  })

  ctx.globalAlpha = 1
}

interface Props {
  active: boolean
  onReveal: () => void  // called mid-flash: switch step while screen is white
  onDone: () => void    // called when overlay fully gone
}

export default function LightningTransition({ active, onReveal, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const aliveRef = useRef(false)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')!
    aliveRef.current = true

    const W = canvas.width, H = canvas.height

    // Generate bolt paths once so they don't flicker between frames
    const startX = W * 0.42 + (Math.random() - 0.5) * W * 0.12
    const endX   = startX + (Math.random() - 0.5) * W * 0.28
    const main   = generateBolt(startX, -30, endX, H + 30, 6)

    const branches: [number, number][][] = []
    for (let b = 0; b < 5; b++) {
      const idx = Math.floor(main.length * (0.1 + Math.random() * 0.7))
      const [bx, by] = main[idx]
      branches.push(
        generateBolt(bx, by, bx + (Math.random() - 0.5) * 200, by + 70 + Math.random() * 150, 4)
      )
    }

    // Secondary (flicker) bolt — slightly different path, shown briefly
    const flickerMain = generateBolt(startX + (Math.random() - 0.5) * 8, -30, endX + (Math.random() - 0.5) * 8, H + 30, 5)

    let revealCalled = false
    let doneCalled   = false
    let startTime: number | null = null
    let frameId: number

    // ── Timing (ms) ──────────────────────────────────────
    const T_DARK_END     = 360   // dark overlay fully in
    const T_BOLT_ON      = 360   // bolt appears
    const T_FLICKER      = 420   // brief secondary bolt
    const T_FLASH_START  = 460   // white flash begins
    const T_REVEAL       = 470   // switch step underneath
    const T_FLASH_PEAK   = 510   // peak white
    const T_FADE_END     = 950   // fully clear
    // ─────────────────────────────────────────────────────

    function tick(ts: number) {
      if (!aliveRef.current) return
      if (!startTime) startTime = ts
      const t = ts - startTime

      ctx.clearRect(0, 0, W, H)

      // ── Phase 1: darken ──────────────────────────────────
      if (t < T_DARK_END) {
        const a = Math.min(t / T_DARK_END, 1) * 0.9
        ctx.fillStyle = `rgba(4,2,12,${a})`
        ctx.fillRect(0, 0, W, H)

      // ── Phase 2: lightning + flicker ─────────────────────
      } else if (t < T_FLASH_START) {
        ctx.fillStyle = 'rgba(4,2,12,0.9)'
        ctx.fillRect(0, 0, W, H)

        if (t >= T_FLICKER && t < T_FLICKER + 40) {
          // Brief secondary flicker bolt
          drawFullBolt(ctx, flickerMain, [], 0.55)
        } else {
          drawFullBolt(ctx, main, branches, 1)
        }

      // ── Phase 3: white flash → fade ───────────────────────
      } else {
        if (!revealCalled && t >= T_REVEAL) {
          revealCalled = true
          onReveal()
        }

        let whiteAlpha: number
        if (t < T_FLASH_PEAK) {
          whiteAlpha = (t - T_FLASH_START) / (T_FLASH_PEAK - T_FLASH_START)
        } else {
          whiteAlpha = 1 - (t - T_FLASH_PEAK) / (T_FADE_END - T_FLASH_PEAK)
          whiteAlpha = Math.max(whiteAlpha, 0)
        }

        ctx.fillStyle = `rgba(255,255,255,${whiteAlpha})`
        ctx.fillRect(0, 0, W, H)

        if (t >= T_FADE_END && !doneCalled) {
          doneCalled = true
          aliveRef.current = false
          onDone()
          return
        }
      }

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => {
      aliveRef.current = false
      cancelAnimationFrame(frameId)
    }
  }, [active, onReveal, onDone])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
      }}
    />
  )
}
