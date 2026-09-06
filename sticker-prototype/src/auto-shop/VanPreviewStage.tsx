import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { type VanPart } from '../data/vanParts'

const SLIDE_MS = 460
const SWIPE_THRESHOLD_PX = 56
const SWIPE_VELOCITY = 0.35 // px/ms
const RUBBER_BAND = 0.28
const AXIS_LOCK_PX = 8

type VanPreviewStageProps = {
  parts: VanPart[]
  activeIndex: number
  onChangeIndex: (index: number) => void
  swipeDisabled?: boolean
}

function shopImageStyle(part: VanPart): CSSProperties {
  const frame = part.shopFrame ?? { widthPercent: 100, leftPercent: 0, topPx: 0 }
  const { widthPercent, leftPercent, topPx = 0 } = frame
  return {
    width: `${widthPercent}%`,
    maxWidth: 'none',
    left: `${leftPercent}%`,
    top: topPx,
    height: 'auto',
    position: 'absolute',
  }
}

/**
 * Drag-following horizontal carousel for Auto Shop parts.
 * The van tracks the finger; release and dot taps ease to the target part.
 */
export function VanPreviewStage({
  parts,
  activeIndex,
  onChangeIndex,
  swipeDisabled = false,
}: VanPreviewStageProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(393)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [suppressTransition, setSuppressTransition] = useState(false)

  const pointerStartX = useRef(0)
  const pointerStartY = useRef(0)
  const pointerId = useRef<number | null>(null)
  const dragOriginOffset = useRef(0)
  const lastMoveX = useRef(0)
  const lastMoveTime = useRef(0)
  const velocityX = useRef(0)
  const lockAxis = useRef<'x' | 'y' | null>(null)
  const activeIndexRef = useRef(activeIndex)
  const dragOffsetRef = useRef(0)
  const settleTimer = useRef<number | null>(null)
  /** Index we expect after our own commit — skips the external-sync effect. */
  const pendingCommitRef = useRef<number | null>(null)
  const syncedIndexRef = useRef(activeIndex)

  activeIndexRef.current = activeIndex
  dragOffsetRef.current = dragOffset

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const node = viewportRef.current
    if (!node) return
    const measure = () => {
      const next = node.getBoundingClientRect().width || 393
      setViewportWidth(next)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    return () => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current)
    }
  }, [])

  const clearSettleTimer = () => {
    if (settleTimer.current) {
      window.clearTimeout(settleTimer.current)
      settleTimer.current = null
    }
  }

  const easeToOffset = (target: number) => {
    if (reducedMotion) {
      setSuppressTransition(false)
      setDragOffset(target)
      return
    }
    setSuppressTransition(false)
    setDragOffset(target)
    clearSettleTimer()
    settleTimer.current = window.setTimeout(() => {
      settleTimer.current = null
    }, SLIDE_MS)
  }

  /** Snap index without a visual jump, then ease residual offset to 0. */
  const settleOnIndex = (nextIndex: number, announce: boolean) => {
    const width = viewportWidth
    const current = activeIndexRef.current
    if (nextIndex === current) {
      setIsDragging(false)
      easeToOffset(0)
      return
    }

    const compensated = dragOffsetRef.current + (nextIndex - current) * width
    setIsDragging(false)
    setSuppressTransition(true)
    setDragOffset(compensated)
    syncedIndexRef.current = nextIndex

    if (announce) {
      pendingCommitRef.current = nextIndex
      onChangeIndex(nextIndex)
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        easeToOffset(0)
      })
    })
  }

  /** Dot taps / external index changes — slide from the previous part. */
  useEffect(() => {
    if (activeIndex === syncedIndexRef.current) return

    if (pendingCommitRef.current === activeIndex) {
      pendingCommitRef.current = null
      syncedIndexRef.current = activeIndex
      return
    }

    pendingCommitRef.current = null
    const previous = syncedIndexRef.current
    syncedIndexRef.current = activeIndex

    if (reducedMotion || isDragging) {
      setSuppressTransition(true)
      setDragOffset(0)
      return
    }

    const delta = activeIndex - previous
    setSuppressTransition(true)
    setDragOffset(delta * viewportWidth)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        easeToOffset(0)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to index changes
  }, [activeIndex, viewportWidth, reducedMotion])

  const clampDrag = (raw: number, index: number) => {
    const atStart = index <= 0
    const atEnd = index >= parts.length - 1
    if ((atStart && raw > 0) || (atEnd && raw < 0)) return raw * RUBBER_BAND
    return raw
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (swipeDisabled || parts.length <= 1) return
    clearSettleTimer()
    setSuppressTransition(true)
    pointerId.current = event.pointerId
    pointerStartX.current = event.clientX
    pointerStartY.current = event.clientY
    dragOriginOffset.current = dragOffsetRef.current
    lastMoveX.current = event.clientX
    lastMoveTime.current = event.timeStamp
    velocityX.current = 0
    lockAxis.current = null
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (swipeDisabled || pointerId.current !== event.pointerId) return

    const dx = event.clientX - pointerStartX.current
    const dy = event.clientY - pointerStartY.current

    if (!lockAxis.current) {
      if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return
      lockAxis.current = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y'
      if (lockAxis.current === 'y') return
      setIsDragging(true)
    }
    if (lockAxis.current !== 'x') return

    event.preventDefault()
    const dt = Math.max(1, event.timeStamp - lastMoveTime.current)
    velocityX.current = (event.clientX - lastMoveX.current) / dt
    lastMoveX.current = event.clientX
    lastMoveTime.current = event.timeStamp
    setDragOffset(clampDrag(dragOriginOffset.current + dx, activeIndexRef.current))
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== event.pointerId) return
    pointerId.current = null

    if (lockAxis.current !== 'x') {
      lockAxis.current = null
      setIsDragging(false)
      return
    }
    lockAxis.current = null

    const offset = dragOffsetRef.current
    const flicked = Math.abs(velocityX.current) > SWIPE_VELOCITY
    const current = activeIndexRef.current
    let next = current

    if (offset <= -SWIPE_THRESHOLD_PX || (flicked && velocityX.current < -SWIPE_VELOCITY)) {
      next = Math.min(parts.length - 1, current + 1)
    } else if (offset >= SWIPE_THRESHOLD_PX || (flicked && velocityX.current > SWIPE_VELOCITY)) {
      next = Math.max(0, current - 1)
    }

    settleOnIndex(next, true)
  }

  const handlePointerCancel = () => {
    pointerId.current = null
    lockAxis.current = null
    setIsDragging(false)
    easeToOffset(0)
  }

  const trackX = -activeIndex * viewportWidth + dragOffset

  const trackStyle: CSSProperties = {
    transform: `translate3d(${trackX}px, 0, 0)`,
    transition:
      suppressTransition || isDragging || reducedMotion
        ? 'none'
        : `transform ${SLIDE_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
  }

  const activePart = parts[activeIndex] ?? parts[0]

  return (
    <div
      ref={viewportRef}
      className={`van-preview-viewport${isDragging ? ' van-preview-viewport--dragging' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      role="img"
      aria-label={`${activePart?.name ?? 'Van part'}. Swipe to browse parts.`}
    >
      <div className="van-preview-track" style={trackStyle}>
        {parts.map((part) => (
          <div key={part.id} className="van-preview-slide">
            <div className="van-preview-stage">
              <div className="van-preview-scene">
                <img
                  className="van-preview-van"
                  src={part.shopSrc}
                  alt=""
                  draggable={false}
                  style={shopImageStyle(part)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

type BeachVanAccessoryProps = {
  part: VanPart
}

/** Composites replace the whole beach van; no separate accessory layer. */
export function BeachVanAccessory(_props: BeachVanAccessoryProps) {
  return null
}
