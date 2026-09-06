import { useEffect, useRef, useState } from 'react'
import { type VanPart } from '../data/vanParts'

const CROSSFADE_MS = 480

type VanPreviewStageProps = {
  part: VanPart
  /** Kept for callers; crossfade is driven by part id changes. */
  transitioning?: boolean
}

/**
 * Centered full-van composites with a soft opacity crossfade between parts.
 * No zoom or pan — the van stays put while the image dissolves.
 */
export function VanPreviewStage({ part }: VanPreviewStageProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [displayPart, setDisplayPart] = useState(part)
  const [outgoingPart, setOutgoingPart] = useState<VanPart | null>(null)
  const [fading, setFading] = useState(false)
  const displayRef = useRef(part)
  const fadeTimer = useRef<number | null>(null)

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

  return (
    <div className="van-preview-viewport" aria-hidden={false}>
      <div className="van-preview-stage">
        <div className="van-preview-scene">
          {outgoingPart ? (
            <img
              className={`van-preview-van van-preview-van--outgoing${fading ? ' van-preview-van--fade-out' : ''}`}
              src={outgoingPart.vanSrc}
              alt=""
              draggable={false}
            />
          ) : null}
          <img
            key={displayPart.id}
            className={`van-preview-van van-preview-van--incoming${fading ? ' van-preview-van--fade-in' : ''}${reducedMotion ? ' van-preview-van--instant' : ''}`}
            src={displayPart.vanSrc}
            alt=""
            draggable={false}
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
