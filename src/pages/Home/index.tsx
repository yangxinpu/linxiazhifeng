import { useRef, useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getLatestQuotes } from '@/api'
import type { Quote } from '@/api'

/** 叶片球面坐标点 */
interface LeafPoint {
  theta: number
  phi: number
  size: number
  rotation: number
  color: string
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [quote, setQuote] = useState<Quote | null>(null)

  const quoteLines = useMemo(() => {
    const text = quote?.content ?? '人文故事与创意'
    return text.split('，')
  }, [quote])
  // 获取最新名言
  useEffect(() => {
    getLatestQuotes({ limit: 1 }).then((res) => {
      if (res.data.length > 0) {
        setQuote(res.data[0])
      }
    }).catch(() => {})
  }, [])
  // 树叶球形动画
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const W = rect.width
    const H = rect.height
    const cx = W / 2
    const cy = H / 2
    const R = Math.min(W, H) * 0.45

    const isDark = document.documentElement.classList.contains('dark')
    const leafColors = isDark
      ? ['rgba(15,217,166,0.85)', 'rgba(59,162,254,0.75)', 'rgba(15,217,166,0.65)', 'rgba(43,138,224,0.6)', 'rgba(25,250,198,0.7)']
      : ['rgba(15,217,166,0.9)', 'rgba(43,138,224,0.8)', 'rgba(15,217,166,0.7)', 'rgba(43,138,224,0.65)', 'rgba(25,250,198,0.75)']

    const LEAF_COUNT = 200
    const leaves: LeafPoint[] = []

    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < LEAF_COUNT; i++) {
      const y = 1 - (i / (LEAF_COUNT - 1)) * 2
      const theta = goldenAngle * i
      leaves.push({
        theta,
        phi: Math.acos(y),
        size: 3 + Math.random() * 3,
        rotation: Math.random() * Math.PI * 2,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
      })
    }

    let animId: number
    let angleY = 0
    let angleX = 0.3
    let velocityY = 0.003
    let velocityX = 0
    let isDragging = false
    let lastX = 0
    let lastY = 0
    let idleTime = 0

    function onPointerDown(e: PointerEvent) {
      isDragging = true
      idleTime = 0
      lastX = e.clientX
      lastY = e.clientY
    }

    function onPointerMove(e: PointerEvent) {
      if (!isDragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      velocityY = dx * 0.005
      velocityX = dy * 0.005
      angleY += velocityY
      angleX += velocityX
      lastX = e.clientX
      lastY = e.clientY
    }

    function onPointerUp() {
      isDragging = false
    }

    canvas.style.touchAction = 'none'
    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    /** 球面坐标 → 屏幕坐标投影 */
    function project(theta: number, phi: number, rotY: number, rotX: number) {
      const x0 = Math.sin(phi) * Math.cos(theta)
      const y0 = Math.cos(phi)
      const z0 = Math.sin(phi) * Math.sin(theta)

      const x1 = x0 * Math.cos(rotY) - z0 * Math.sin(rotY)
      const z1 = x0 * Math.sin(rotY) + z0 * Math.cos(rotY)
      const y1 = y0 * Math.cos(rotX) - z1 * Math.sin(rotX)
      const z2 = y0 * Math.sin(rotX) + z1 * Math.cos(rotX)

      const perspective = 3
      const scale = perspective / (perspective + z2)

      return {
        sx: cx + x1 * R * scale,
        sy: cy + y1 * R * scale,
        z: z2,
        scale,
      }
    }

    function drawLeaf(px: number, py: number, size: number, angle: number, color: string, alpha: number) {
      ctx!.save()
      ctx!.translate(px, py)
      ctx!.rotate(angle)
      ctx!.globalAlpha = alpha
      ctx!.fillStyle = color
      ctx!.beginPath()
      ctx!.moveTo(0, -size)
      ctx!.bezierCurveTo(size * 0.8, -size * 0.5, size * 0.6, size * 0.5, 0, size)
      ctx!.bezierCurveTo(-size * 0.6, size * 0.5, -size * 0.8, -size * 0.5, 0, -size)
      ctx!.fill()
      ctx!.restore()
    }

    /** 主动画循环 */
    function animate() {
      ctx!.clearRect(0, 0, W, H)

      if (!isDragging) {
        idleTime++
        if (idleTime > 60) {
          velocityY += (0.003 - velocityY) * 0.02
          velocityX *= 0.95
        }
        velocityY *= 0.98
        velocityX *= 0.98
        angleY += velocityY
        angleX += velocityX
      }

      const projected = leaves.map((leaf) => {
        const p = project(leaf.theta, leaf.phi, angleY, angleX)
        return { ...leaf, ...p }
      })

      projected.sort((a, b) => a.z - b.z)

      projected.forEach((leaf) => {
        const depthAlpha = 0.3 + (leaf.z + 1) * 0.35
        const depthSize = leaf.size * leaf.scale
        drawLeaf(leaf.sx, leaf.sy, depthSize, leaf.rotation + angleY * 0.5, leaf.color, depthAlpha)
      })

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  return (
    <section className="flex items-center">
      <div className="max-w-5xl mx-auto px-6 w-full">
        <div className="flex flex-col">
          <div className="pt-8 pb-4 md:pt-10 md:pb-6">
            <div className="inline-flex flex-col items-start gap-4">
              <h1 className="text-2xl md:text-3xl font-bold leading-snug text-foreground" style={{ fontFamily: 'var(--font-quote)' }}>
                {quoteLines.map((line, i) => (
                  <span
                    key={i}
                    className="inline-block"
                    style={{ animation: `reveal-text 0.8s ease-out ${i * 0.4 + 0.2}s both` }}
                  >
                    {line}{i < quoteLines.length - 1 ? '，' : ''}
                    {i < quoteLines.length - 1 && <br />}
                  </span>
                ))}
              </h1>
              {quote && (
                <p
                  className="text-sm md:text-base text-muted-foreground opacity-0 w-full text-right translate-x-10"
                  style={{ animation: `fade-in-up 0.3s ease-out ${quoteLines.length * 0.4 + 1}s forwards` }}
                >
                  —— {quote.author}《{quote.source}》
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 md:gap-10 items-center">
            <div className="flex flex-col items-center">
              <div className="space-y-6">
                <p className="flex flex-row items-center gap-4">
                  <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-quote)' }}>林下之风</span>
                  <span className="w-px h-5 bg-muted-foreground/40"></span>
                  <span className="text-sm md:text-base text-muted-foreground tracking-widest">GROVEGRACE</span>
                </p>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-left">
                  一个阅读、提升，以及深化理解的地方
                </p>
                <p className="text-sm md:text-base text-muted-foreground/70 leading-relaxed text-left">
                  每日更新，持续成长
                </p>
                <div className="flex gap-4">
                  <Link to="/articles" className="px-6 py-2 rounded-md font-medium text-base bg-primary text-primary-foreground transition-all duration-200 hover:opacity-90 hover:shadow-lg">
                    阅读文章
                  </Link>
                  <Link to="/quotes" className="px-6 py-2 rounded-md font-medium text-base border border-primary/30 text-primary transition-all duration-200 hover:bg-primary/10 hover:shadow-lg">
                    阅读名言
                  </Link>
                </div>
              </div>
            </div>

            <div
              className="opacity-0"
              style={{ animation: 'fade-in-up 0.8s ease-out 0.4s forwards' }}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ display: 'block' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}