import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { getLatestQuotes } from '@/api'
import type { Quote } from '@/api'
import styles from './index.module.scss'

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
    <section className={styles.section}>
      <div className={styles.container}>
        <div>
          <div className={styles.header}>
            <div className={styles.quoteBox}>
              <h1 className={styles.quoteTitle}>
                {quoteLines.map((line, i) => (
                  <span
                    key={i}
                    className={styles.quoteLine}
                    style={{ '--reveal-delay': `${i * 0.4 + 0.2}s` } as CSSProperties}
                  >
                    {line}{i < quoteLines.length - 1 ? '，' : ''}
                    {i < quoteLines.length - 1 && <br />}
                  </span>
                ))}
              </h1>
              {quote && (
                <p
                  className={styles.quoteMeta}
                  style={{ '--meta-delay': `${quoteLines.length * 0.4 + 1}s` } as CSSProperties}
                >
                  —— {quote.author}《{quote.source}》
                </p>
              )}
            </div>
          </div>

          <div className={styles.mainGrid}>
            <div className={styles.leftCol}>
              <div className={styles.leftColInner}>
                <p className={styles.brandRow}>
                  <span className={styles.brandName}>林下之风</span>
                  <span className={styles.brandDivider} />
                  <span className={styles.brandEn}>Linxiazhifeng</span>
                </p>
                <p className={styles.descPrimary}>
                  一个阅读、提升，以及深化理解的地方
                </p>
                <p className={styles.descSecondary}>
                  每日更新，持续成长
                </p>
                <div className={styles.btnGroup}>
                  <Link to="/articles" className={styles.btnPrimary}>
                    阅读文章
                  </Link>
                  <Link to="/quotes" className={styles.btnSecondary}>
                    阅读名言
                  </Link>
                </div>
              </div>
            </div>

            <div
              className={styles.canvasWrap}
            >
              <canvas
                ref={canvasRef}
                className={styles.canvas}
                aria-label="可拖动旋转的树叶球动画"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
