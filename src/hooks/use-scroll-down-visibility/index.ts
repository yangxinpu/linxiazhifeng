import { useEffect, useRef, useState } from 'react'

const DEFAULT_SCROLL_THRESHOLD = 4

/** 向下滚动时显示，向上滚动或回到页面顶部时隐藏。 */
export function useScrollDownVisibility(threshold = DEFAULT_SCROLL_THRESHOLD) {
  const scrollFrameRef = useRef<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let previousScrollY = window.scrollY

    function updateVisibility() {
      const currentScrollY = window.scrollY
      const scrollDistance = currentScrollY - previousScrollY

      if (currentScrollY <= 0 || scrollDistance <= -threshold) {
        setIsVisible(false)
      } else if (scrollDistance >= threshold) {
        setIsVisible(true)
      }

      previousScrollY = currentScrollY
      scrollFrameRef.current = null
    }

    function handleScroll() {
      if (scrollFrameRef.current === null) {
        scrollFrameRef.current = window.requestAnimationFrame(updateVisibility)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)

      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current)
      }
    }
  }, [threshold])

  return isVisible
}
