import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { type VanPart } from '../data/vanParts'

const TRANSITION_MS = 380
const SWIPE_THRESHOLD_PX = 56
const SWIPE_VELOCITY = 0.35
const DRAG_PARALLAX = 0.38
const EXIT_NUDGE_PX = 24
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

type LayerProps = {
  part: VanPart
  className?: string
  style?: CSSProperties
}

function VanLayer({ part, className = '', style }: LayerProps) {
  return (
    <div className={`van-preview-layer ${className}`.trim()} style={style} aria-hidden>
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
  )
}

/**
 * Swipe-driven part switcher. Layers fade + nudge inside one frame so
 * intentionally cropped shop art never appears cut in half mid-slide.
 */
export function VanPreviewStage({
  parts,
  activeIndex,
  onChangeIndex,
  swipeDisabled = false,
}: VanPreviewStageProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [settleDir, setSettleDir] = useState<0 | -1 | 1>(0)
  const [outgoingPart, setOutgoingPart] = useState<VanPart | null>(null)
  const [settleActive, setSettleActive] = useState(false)

  const pointerStartX = useRef(0)
  const pointerStartY = useRef(0)
  const pointerId = useRef<number | null>(null)
  const lastMoveX = useRef(0)
  const lastMoveTime = useRef(0)
  const velocityX = useRef(0)
  const lockAxis = useRef<'x' | 'y' | null>(null)
  const activeIndexRef = useRef(activeIndex)
  const dragXRef = useRef(0)
  const settleTimer = useRef<number | null>(null)
  const pendingCommitRef = useRef<number | null>(null)
  const syncedIndexRef = useRef(activeIndex)

  activeIndexRef.current = activeIndex
  dragXRef.current = dragX

  const activePart = parts[activeIndex] ?? parts[0]

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
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

  const finishSettle = () => {
    clearSettleTimer()
    setOutgoingPart(null)
    setSettleDir(0)
    setSettleActive(false)
    setDragX(0)
  }

  const runSettleAnimation = () => {
    if (reducedMotion) {
      finishSettle()
      return
    }
    setSettleActive(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSettleActive(true))
    })
    clearSettleTimer()
    settleTimer.current = window.setTimeout(finishSettle, TRANSITION_MS)
  }

  const beginTransition = (nextIndex: number, announce: boolean) => {
    const current = activeIndexRef.current
    if (nextIndex === current || nextIndex < 0 || nextIndex >= parts.length) {
      setIsDragging(false)
      setDragX(0)
      return
    }
    const dir = (nextIndex > current ? -1 : 1) as -1 | 1
    setIsDragging(false)
    setOutgoingPart(parts[current])
    setSettleDir(dir)
    setDragX(0)
    syncedIndexRef.current = nextIndex
    if (announce) {
      pendingCommitRef.current = nextIndex
      onChangeIndex(nextIndex)
    }
    runSettleAnimation()
  }

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
    const fromPart = parts[previous]
    if (!fromPart || reducedMotion) {
      finishSettle()
      return
    }
    setOutgoingPart(fromPart)
    setSettleDir((activeIndex > previous ? -1 : 1) as -1 | 1)
    setDragX(0)
    runSettleAnimation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, reducedMotion, parts])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (swipeDisabled || parts.length <= 1) return
    clearSettleTimer()
    setOutgoingPart(null)
    setSettleDir(0)
    setSettleActive(false)
    pointerId.current = event.pointerId
    pointerStartX.current = event.clientX
    pointerStartY.current = event.clientY
    lastMoveX.current = event.clientX
    lastMoveTime.current = event.timeStamp
    velocityX.current = 0
    lockAxis.current = null
    setDragX(0)
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
    const current = activeIndexRef.current
    const atStart = current <= 0 && dx > 0
    const atEnd = current >= parts.length - 1 && dx < 0
    setDragX(atStart || atEnd ? dx * 0.28 : dx)
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
    const dx = dragXRef.current
    const flicked = Math.abs(velocityX.current) > SWIPE_VELOCITY
    const current = activeIndexRef.current
    let next = current
    if (dx <= -SWIPE_THRESHOLD_PX || (flicked && velocityX.current < -SWIPE_VELOCITY)) {
      next = Math.min(parts.length - 1, current + 1)
    } else if (dx >= SWIPE_THRESHOLD_PX || (flicked && velocityX.current > SWIPE_VELOCITY)) {
      next = Math.max(0, current - 1)
    }
    if (next === current) {
      setIsDragging(false)
      setDragX(0)
      return
    }
    beginTransition(next, true)
  }

  const handlePointerCancel = () => {
    pointerId.current = null
    lockAxis.current = null
    setIsDragging(false)
    setDragX(0)
  }

  const dragProgress = Math.max(-1, Math.min(1, dragX / 140))
  const peekIndex =
    dragProgress < -0.04
      ? Math.min(parts.length - 1, activeIndex + 1)
      : dragProgress > 0.04
        ? Math.max(0, activeIndex - 1)
        : null
  const peekPart = peekIndex != null && peekIndex !== activeIndex ? parts[peekIndex] : null
  const peekAmount = Math.abs(dragProgress)
  const settling = settleDir !== 0 && outgoingPart != null

  return (
    <div
      className={`van-preview-viewport${isDragging ? ' van-preview-viewport--dragging' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      role="img"
      aria-label={`${activePart?.name ?? 'Van part'}. Swipe to browse parts.`}
    >
      <div className="van-preview-stack">
        {settling && outgoingPart ? (
          <>
            <VanLayer
              part={outgoingPart}
              className={`van-preview-layer--exit${settleActive ? ' van-preview-layer--exit-active' : ''}`}
              style={{ '--van-exit-x': `${settleDir * EXIT_NUDGE_PX}px` } as CSSProperties}
            />
            <VanLayer
              part={activePart}
              className={`van-preview-layer--enter${settleActive ? ' van-preview-layer--enter-active' : ''}`}
              style={{ '--van-enter-x': `${-settleDir * EXIT_NUDGE_PX}px` } as CSSProperties}
            />
          </>
        ) : (
          <>
            {peekPart ? (
              <VanLayer
                part={peekPart}
                style={{
                  opacity: peekAmount * 0.92,
                  transform: `translate3d(${
                    dragX * DRAG_PARALLAX +
                    (dragProgress < 0 ? EXIT_NUDGE_PX : -EXIT_NUDGE_PX) * (1 - peekAmount)
                  }px, 0, 0)`,
                  zIndex: 1,
                  transition: 'none',
                }}
              />
            ) : null}
            <VanLayer
              part={activePart}
              style={{
                opacity: peekPart ? 1 - peekAmount * 0.8 : 1,
                transform: `translate3d(${dragX * DRAG_PARALLAX}px, 0, 0)`,
                zIndex: 2,
                transition:
                  isDragging || reducedMotion
                    ? 'none'
                    : `opacity ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}

type BeachVanAccessoryProps = { part: VanPart }

/** Composites replace the whole beach van; no separate accessory layer. */
export function BeachVanAccessory(_props: BeachVanAccessoryProps) {
  return null
}
