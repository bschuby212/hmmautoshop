import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { type VanPart } from '../data/vanParts'

const TRANSITION_MS = 280
const SWIPE_THRESHOLD_PX = 56
const SWIPE_VELOCITY = 0.35
const AXIS_LOCK_PX = 8

type VanPreviewStageProps = {
  parts: VanPart[]
  activeIndex: number
  onChangeIndex: (index: number) => void
  swipeDisabled?: boolean
}

function shopImageStyle(part: VanPart): CSSProperties {
  const frame = part.shopFrame
  return {
    position: 'absolute',
    width: frame.widthPx,
    height: frame.heightPx,
    left: frame.leftPx,
    top: frame.topPx ?? 0,
    maxWidth: 'none',
    objectFit: 'cover',
  }
}

type LayerProps = {
  part: VanPart
  className?: string
}

function VanLayer({ part, className = '' }: LayerProps) {
  return (
    <div className={`van-preview-layer ${className}`.trim()} aria-hidden>
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
 * Swipe/dot part switcher. Current van stays fully opaque underneath;
 * outgoing layer fades out on top — never leaves the active van stuck at 0.
 */
export function VanPreviewStage({
  parts,
  activeIndex,
  onChangeIndex,
  swipeDisabled = false,
}: VanPreviewStageProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [outgoingPart, setOutgoingPart] = useState<VanPart | null>(null)
  const [exitActive, setExitActive] = useState(false)

  const pointerStartX = useRef(0)
  const pointerStartY = useRef(0)
  const pointerId = useRef<number | null>(null)
  const lastMoveX = useRef(0)
  const lastMoveTime = useRef(0)
  const velocityX = useRef(0)
  const lockAxis = useRef<'x' | 'y' | null>(null)
  const activeIndexRef = useRef(activeIndex)
  const dragDxRef = useRef(0)
  const fadeTimer = useRef<number | null>(null)
  const pendingCommitRef = useRef<number | null>(null)
  const syncedIndexRef = useRef(activeIndex)

  activeIndexRef.current = activeIndex

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
      if (fadeTimer.current) window.clearTimeout(fadeTimer.current)
    }
  }, [])

  const clearFadeTimer = () => {
    if (fadeTimer.current) {
      window.clearTimeout(fadeTimer.current)
      fadeTimer.current = null
    }
  }

  const finishFade = () => {
    clearFadeTimer()
    setOutgoingPart(null)
    setExitActive(false)
  }

  const runCrossfade = (fromPart: VanPart) => {
    if (reducedMotion) {
      finishFade()
      return
    }
    clearFadeTimer()
    setOutgoingPart(fromPart)
    setExitActive(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setExitActive(true))
    })
    fadeTimer.current = window.setTimeout(finishFade, TRANSITION_MS)
  }

  const beginTransition = (nextIndex: number, announce: boolean) => {
    const current = activeIndexRef.current
    if (nextIndex === current || nextIndex < 0 || nextIndex >= parts.length) return

    const fromPart = parts[current]
    syncedIndexRef.current = nextIndex
    if (announce) {
      pendingCommitRef.current = nextIndex
      onChangeIndex(nextIndex)
    }
    if (fromPart) runCrossfade(fromPart)
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
    if (!fromPart) {
      finishFade()
      return
    }
    runCrossfade(fromPart)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, reducedMotion, parts])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (swipeDisabled || parts.length <= 1) return
    pointerId.current = event.pointerId
    pointerStartX.current = event.clientX
    pointerStartY.current = event.clientY
    lastMoveX.current = event.clientX
    lastMoveTime.current = event.timeStamp
    velocityX.current = 0
    lockAxis.current = null
    dragDxRef.current = 0
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
    }
    if (lockAxis.current !== 'x') return
    event.preventDefault()
    const dt = Math.max(1, event.timeStamp - lastMoveTime.current)
    velocityX.current = (event.clientX - lastMoveX.current) / dt
    lastMoveX.current = event.clientX
    lastMoveTime.current = event.timeStamp
    dragDxRef.current = dx
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== event.pointerId) return
    pointerId.current = null
    if (lockAxis.current !== 'x') {
      lockAxis.current = null
      return
    }
    lockAxis.current = null
    const dx = dragDxRef.current
    const flicked = Math.abs(velocityX.current) > SWIPE_VELOCITY
    const current = activeIndexRef.current
    let next = current
    if (dx <= -SWIPE_THRESHOLD_PX || (flicked && velocityX.current < -SWIPE_VELOCITY)) {
      next = Math.min(parts.length - 1, current + 1)
    } else if (dx >= SWIPE_THRESHOLD_PX || (flicked && velocityX.current > SWIPE_VELOCITY)) {
      next = Math.max(0, current - 1)
    }
    dragDxRef.current = 0
    if (next !== current) beginTransition(next, true)
  }

  const handlePointerCancel = () => {
    pointerId.current = null
    lockAxis.current = null
    dragDxRef.current = 0
  }

  return (
    <div
      className="van-preview-viewport"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      role="img"
      aria-label={`${activePart?.name ?? 'Van part'}. Swipe to browse parts.`}
    >
      <div className="van-preview-stack">
        {/* Current always fully opaque underneath — never stuck faded. */}
        <VanLayer part={activePart} className="van-preview-layer--current" />
        {outgoingPart ? (
          <VanLayer
            part={outgoingPart}
            className={`van-preview-layer--exit${exitActive ? ' van-preview-layer--exit-active' : ''}`}
          />
        ) : null}
      </div>
    </div>
  )
}

type BeachVanAccessoryProps = { part: VanPart }

/** Composites replace the whole beach van; no separate accessory layer. */
export function BeachVanAccessory(_props: BeachVanAccessoryProps) {
  return null
}
