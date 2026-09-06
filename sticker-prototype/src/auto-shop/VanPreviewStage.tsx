import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { type VanPart } from '../data/vanParts'

const CROSSFADE_MS = 480
const SWIPE_THRESHOLD_PX = 48

type VanPreviewStageProps = {
  part: VanPart
  /** Kept for callers; crossfade is driven by part id changes. */
  transitioning?: boolean
  onSwipePrevious?: () => void
  onSwipeNext?: () => void
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
 * Shop carousel preview — Figma-framed van composites.
 * Horizontal swipe moves between the three parts.
 */
export function VanPreviewStage({
  part,
  onSwipePrevious,
  onSwipeNext,
  swipeDisabled = false,
}: VanPreviewStageProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [displayPart, setDisplayPart] = useState(part)
  const [outgoingPart, setOutgoingPart] = useState<VanPart | null>(null)
  const [fading, setFading] = useState(false)
  const displayRef = useRef(part)
  const fadeTimer = useRef<number | null>(null)
  const pointerStartX = useRef<number | null>(null)
  const pointerId = useRef<number | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (part.id === displayRef.current.id) return

    if (fadeTimer.current) window.clearTimeout(fadeTimer.current)

    if (reducedMotion) {
      displayRef.current = part
      setOutgoingPart(null)
      setDisplayPart(part)
      setFading(false)
      return
    }

    setOutgoingPart(displayRef.current)
    displayRef.current = part
    setDisplayPart(part)
    setFading(true)
    fadeTimer.current = window.setTimeout(() => {
      setOutgoingPart(null)
      setFading(false)
      fadeTimer.current = null
    }, CROSSFADE_MS)
  }, [part, reducedMotion])

  useEffect(() => {
    return () => {
      if (fadeTimer.current) window.clearTimeout(fadeTimer.current)
    }
  }, [])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (swipeDisabled) return
    pointerStartX.current = event.clientX
    pointerId.current = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (swipeDisabled || pointerStartX.current == null) return
    if (pointerId.current != null && event.pointerId !== pointerId.current) return

    const deltaX = event.clientX - pointerStartX.current
    pointerStartX.current = null
    pointerId.current = null

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return
    if (deltaX < 0) onSwipeNext?.()
    else onSwipePrevious?.()
  }

  const handlePointerCancel = () => {
    pointerStartX.current = null
    pointerId.current = null
  }

  return (
    <div
      className="van-preview-viewport"
      aria-hidden={false}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      role="img"
      aria-label={`${displayPart.name}. Swipe to browse parts.`}
    >
      <div className="van-preview-stage">
        <div className="van-preview-scene">
          {outgoingPart ? (
            <img
              className={`van-preview-van van-preview-van--outgoing${fading ? ' van-preview-van--fade-out' : ''}`}
              src={outgoingPart.shopSrc}
              alt=""
              draggable={false}
              style={shopImageStyle(outgoingPart)}
            />
          ) : null}
          <img
            key={displayPart.id}
            className={`van-preview-van van-preview-van--incoming${fading ? ' van-preview-van--fade-in' : ''}${reducedMotion ? ' van-preview-van--instant' : ''}`}
            src={displayPart.shopSrc}
            alt=""
            draggable={false}
            style={shopImageStyle(displayPart)}
          />
        </div>
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
