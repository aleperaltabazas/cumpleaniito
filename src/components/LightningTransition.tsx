import { useEffect, useRef } from 'react'

// ── Timing (ms from animation start) ────────────────────────
const T_DARK_END       = 180   // darken complete
const T_HOLD_END       = 1680  // hold dark (1.5 s of darkness)
const T_BOLT_DURATION  = 150   // bolt draws itself top-to-bottom
const T_BOLT_DONE      = T_HOLD_END + T_BOLT_DURATION   // 1830
const T_FLICKER        = T_HOLD_END + 55                // 1735  brief secondary flash mid-strike
const T_FLASH_START    = T_BOLT_DONE + 200              // 2030
const T_REVEAL         = T_FLASH_START                  // 2030
const T_FLASH_PEAK     = T_FLASH_START + 60             // 2090
const T_FADE_END       = T_FLASH_PEAK + 1000            // 3090
// firework burst schedule (ms) — spread across the 1 s fade window
const FW_SCHEDULE      = [2120, 2300, 2480, 2660, 2840, 3000]
// ─────────────────────────────────────────────────────────────

const FW_COLORS = ['#f0c95c', '#e8703a', '#c9a227', '#f4e9cc', '#e0a15a', '#ffffff']

interface FwParticle {
  x: number; y: number; vx: number; vy: number
  life: number; decay: number; size: number; color: string
}

function spawnBurst(particles: FwParticle[], x: number, y: number, W: number, H: number) {
  const count = 38 + Math.floor(Math.random() * 14)
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.25
    const speed = 2 + Math.random() * (Math.min(W, H) * 0.008)
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.01 + Math.random() * 0.012,
      size: 1.8 + Math.random() * 2.2,
      color: FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)],
    })
  }
}

// ── Bolt helpers ─────────────────────────────────────────────

interface Branch {
  points: [number, number][]
  mainIdx: number  // where on the main bolt this branch starts
}

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

function strokePoints(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  width: number,
  color: string,
  alpha: number,
  count?: number    // draw only first `count` points (partial reveal)
) {
  const pts = count !== undefined ? points.slice(0, Math.max(2, count)) : points
  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.lineJoin = 'round'
  ctx.beginPath()
  pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
  ctx.stroke()
}

function drawBolt(
  ctx: CanvasRenderingContext2D,
  main: [number, number][],
  branches: Branch[],
  revealPct: number,   // 0–1: how far the bolt has drawn itself
  baseAlpha = 1
) {
  const revealed = Math.max(2, Math.floor(main.length * revealPct))

  // Main bolt — four glow passes
  strokePoints(ctx, main, 50, 'rgba(80,120,255,0.06)', baseAlpha, revealed)
  strokePoints(ctx, main, 22, 'rgba(140,190,255,0.22)', baseAlpha, revealed)
  strokePoints(ctx, main, 8,  'rgba(210,235,255,0.7)',  baseAlpha, revealed)
  strokePoints(ctx, main, 2.5,'#ffffff',                baseAlpha, revealed)

  // Branches — appear once the main bolt has passed their origin
  branches.forEach(branch => {
    const branchStart = branch.mainIdx / main.length
    if (revealPct <= branchStart) return
    const branchReveal = Math.min((revealPct - branchStart) / 0.25, 1)  // reveal over 25% of overall
    const bc = Math.max(2, Math.floor(branch.points.length * branchReveal))
    strokePoints(ctx, branch.points, 10, 'rgba(140,190,255,0.18)', baseAlpha * 0.7, bc)
    strokePoints(ctx, branch.points, 3,  'rgba(210,235,255,0.6)',  baseAlpha * 0.7, bc)
    strokePoints(ctx, branch.points, 1.2,'#ffffff',                baseAlpha * 0.65, bc)
  })

  ctx.globalAlpha = 1
}

// ── Component ─────────────────────────────────────────────────

interface Props {
  active: boolean
  onReveal: () => void
  onDone: () => void
}

export default function LightningTransition({ active, onReveal, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const aliveRef = useRef(false)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')!
    aliveRef.current = true

    const W = canvas.width, H = canvas.height

    // Generate bolt geometry once (stable across frames)
    const startX = W * 0.42 + (Math.random() - 0.5) * W * 0.12
    const endX   = startX + (Math.random() - 0.5) * W * 0.28
    const main   = generateBolt(startX, -30, endX, H + 30, 6)

    const branches: Branch[] = []
    for (let b = 0; b < 5; b++) {
      const mainIdx = Math.floor(main.length * (0.08 + Math.random() * 0.72))
      const [bx, by] = main[mainIdx]
      branches.push({
        mainIdx,
        points: generateBolt(bx, by, bx + (Math.random() - 0.5) * 220, by + 60 + Math.random() * 160, 4),
      })
    }

    // Flicker bolt — slightly offset path, shown briefly mid-strike
    const flickerMain = generateBolt(
      startX + (Math.random() - 0.5) * 10, -30,
      endX   + (Math.random() - 0.5) * 10, H + 30, 5
    )

    // Fireworks state
    const fwParticles: FwParticle[] = []
    const fwFired = new Set<number>()

    let revealCalled = false
    let doneCalled   = false
    let startTime: number | null = null
    let frameId: number

    function tick(ts: number) {
      if (!aliveRef.current) return
      if (!startTime) startTime = ts
      const t = ts - startTime

      ctx.clearRect(0, 0, W, H)

      // ── Phase 1: darken ────────────────────────────────────
      if (t < T_DARK_END) {
        const a = Math.min(t / T_DARK_END, 1) * 0.92
        ctx.fillStyle = `rgba(4,2,12,${a})`
        ctx.fillRect(0, 0, W, H)

      // ── Phase 2: hold dark ─────────────────────────────────
      } else if (t < T_HOLD_END) {
        ctx.fillStyle = 'rgba(4,2,12,0.92)'
        ctx.fillRect(0, 0, W, H)

      // ── Phase 3: bolt strike ───────────────────────────────
      } else if (t < T_FLASH_START) {
        ctx.fillStyle = 'rgba(4,2,12,0.92)'
        ctx.fillRect(0, 0, W, H)

        const revealPct = Math.min((t - T_HOLD_END) / T_BOLT_DURATION, 1)
        drawBolt(ctx, main, branches, revealPct, 1)

        // Brief secondary flash ~55ms into the strike
        if (t >= T_FLICKER && t < T_FLICKER + 45) {
          const flickerPct = Math.min((t - T_HOLD_END) / T_BOLT_DURATION, 1)
          drawBolt(ctx, flickerMain, [], flickerPct, 0.45)
        }

      // ── Phase 4: white flash → slow fade + fireworks ───────
      } else {
        if (!revealCalled) {
          revealCalled = true
          onReveal()
        }

        // Spawn fireworks on schedule
        FW_SCHEDULE.forEach(ms => {
          if (t >= ms && !fwFired.has(ms)) {
            fwFired.add(ms)
            const x = W * 0.1 + Math.random() * W * 0.8
            const y = H * 0.08 + Math.random() * H * 0.5
            spawnBurst(fwParticles, x, y, W, H)
          }
        })

        // Update + draw fireworks (under the white overlay)
        for (let i = fwParticles.length - 1; i >= 0; i--) {
          const p = fwParticles[i]
          p.x += p.vx; p.y += p.vy
          p.vy += 0.022
          p.life -= p.decay
          if (p.life <= 0) { fwParticles.splice(i, 1); continue }
          ctx.globalAlpha = Math.max(p.life, 0)
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1

        // White overlay on top of fireworks
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
