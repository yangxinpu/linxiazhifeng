import { useEffect, useRef } from 'react'
import styles from './index.module.scss'

interface LeafPoint {
  theta: number // 纬度
  phi: number // 经度
  size: number // 大小
  rotation: number // 旋转角度
  colorIndex: number // 颜色索引
}

const LEAF_COUNT = 300 // 叶片数量
const MAX_DEVICE_PIXEL_RATIO = 2 // 最大设备像素比
const AUTO_ROTATION_SPEED = 0.003 // 自动旋转速度

function createLeaves(): LeafPoint[] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))

  return Array.from({ length: LEAF_COUNT }, (_, index) => {
    const y = 1 - (index / (LEAF_COUNT - 1)) * 2

    return {
      theta: goldenAngle * index,
      phi: Math.acos(y),
      size: 5 + Math.random() * 5,
      rotation: Math.random() * Math.PI * 2,
      colorIndex: index % 2,
    }
  })
}

/** 首页可拖动的品牌叶片球视觉。 */
export default function LeafSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasNode = canvasRef.current
    if (!canvasNode) return

    const contextNode = canvasNode.getContext('2d')
    if (!contextNode) return

    const canvas: HTMLCanvasElement = canvasNode
    const context: CanvasRenderingContext2D = contextNode

    const leaves = createLeaves()
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrameId: number | null = null
    let width = 0
    let height = 0
    let centerX = 0
    let centerY = 0
    let radius = 0
    let angleY = 0
    let angleX = 0.28
    let velocityY = AUTO_ROTATION_SPEED
    let velocityX = 0
    let isDragging = false
    let lastPointerX = 0
    let lastPointerY = 0
    let idleFrames = 0
    let colors = ['', '']

    function updateColors() {
      const rootStyles = window.getComputedStyle(document.documentElement)
      colors = [
        rootStyles.getPropertyValue('--brand-a').trim() || '#087f65',
        rootStyles.getPropertyValue('--brand-b').trim() || '#2675ad',
      ]
    }

    function project(theta: number, phi: number) {
      const sourceX = Math.sin(phi) * Math.cos(theta)
      const sourceY = Math.cos(phi)
      const sourceZ = Math.sin(phi) * Math.sin(theta)
      const rotatedX = sourceX * Math.cos(angleY) - sourceZ * Math.sin(angleY)
      const rotatedZ = sourceX * Math.sin(angleY) + sourceZ * Math.cos(angleY)
      const rotatedY = sourceY * Math.cos(angleX) - rotatedZ * Math.sin(angleX)
      const depth = sourceY * Math.sin(angleX) + rotatedZ * Math.cos(angleX)
      const scale = 3 / (3 + depth)

      return {
        screenX: centerX + rotatedX * radius * scale,
        screenY: centerY + rotatedY * radius * scale,
        depth,
        scale,
      }
    }

    function drawLeaf(
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      alpha: number,
    ) {
      context.save()
      context.translate(x, y)
      context.rotate(rotation)
      context.globalAlpha = alpha
      context.fillStyle = color
      context.beginPath()
      context.moveTo(0, -size)
      context.bezierCurveTo(
        size * 0.82,
        -size * 0.48,
        size * 0.58,
        size * 0.52,
        0,
        size,
      )
      context.bezierCurveTo(
        -size * 0.58,
        size * 0.52,
        -size * 0.82,
        -size * 0.48,
        0,
        -size,
      )
      context.fill()
      context.restore()
    }

    function drawFrame() {
      context.clearRect(0, 0, width, height)

      const projectedLeaves = leaves
        .map((leaf) => ({ ...leaf, ...project(leaf.theta, leaf.phi) }))
        .sort((first, second) => first.depth - second.depth)

      projectedLeaves.forEach((leaf) => {
        drawLeaf(
          leaf.screenX,
          leaf.screenY,
          leaf.size * leaf.scale,
          leaf.rotation + angleY * 0.5,
          colors[leaf.colorIndex],
          0.28 + (leaf.depth + 1) * 0.34,
        )
      })
    }

    function animate() {
      if (!isDragging) {
        idleFrames += 1
        if (idleFrames > 60) {
          velocityY += (AUTO_ROTATION_SPEED - velocityY) * 0.02
          velocityX *= 0.95
        }
        velocityY *= 0.98
        velocityX *= 0.98
        angleY += velocityY
        angleX += velocityX
      }

      drawFrame()
      animationFrameId = window.requestAnimationFrame(animate)
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect()
      const devicePixelRatio = Math.min(
        window.devicePixelRatio || 1,
        MAX_DEVICE_PIXEL_RATIO,
      )

      width = rect.width
      height = rect.height
      centerX = width / 2
      centerY = height / 2
      radius = Math.min(width, height) * 0.42
      canvas.width = Math.round(width * devicePixelRatio)
      canvas.height = Math.round(height * devicePixelRatio)
      context.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0,
      )
      drawFrame()
    }

    function handlePointerDown(event: PointerEvent) {
      isDragging = true
      idleFrames = 0
      lastPointerX = event.clientX
      lastPointerY = event.clientY
      canvas.setPointerCapture(event.pointerId)
    }

    function handlePointerMove(event: PointerEvent) {
      if (!isDragging) return

      const deltaX = event.clientX - lastPointerX
      const deltaY = event.clientY - lastPointerY
      velocityY = deltaX * 0.005
      velocityX = deltaY * 0.005
      angleY += velocityY
      angleX += velocityX
      lastPointerX = event.clientX
      lastPointerY = event.clientY

      if (motionQuery.matches) {
        drawFrame()
      }
    }

    function handlePointerUp(event: PointerEvent) {
      isDragging = false
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId)
      }
    }

    function handleMotionPreferenceChange() {
      if (motionQuery.matches && animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId)
        animationFrameId = null
        drawFrame()
      } else if (!motionQuery.matches && animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(animate)
      }
    }

    const resizeObserver = new ResizeObserver(resizeCanvas)
    const themeObserver = new MutationObserver(() => {
      updateColors()
      drawFrame()
    })

    updateColors()
    resizeObserver.observe(canvas)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('pointercancel', handlePointerUp)
    motionQuery.addEventListener('change', handleMotionPreferenceChange)

    if (!motionQuery.matches) {
      animationFrameId = window.requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId)
      }
      resizeObserver.disconnect()
      themeObserver.disconnect()
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointercancel', handlePointerUp)
      motionQuery.removeEventListener('change', handleMotionPreferenceChange)
    }
  }, [])

  return (
    <div className={styles.sphere}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        role="img"
        aria-label="由绿色与蓝色叶片组成的旋转球体"
      />
    </div>
  )
}
