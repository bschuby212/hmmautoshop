import { useEffect, useState, type CSSProperties } from 'react'
import { type VanPart, type VanPartCamera } from '../data/vanParts'

/** Keep the full van centered; cameras only nudge gently on swipe. */
const BASE_FRAME_Y = 0

function cameraStyle(camera: VanPartCamera, reducedMotion: boolean): CSSProperties {
  const duration = reducedMotion ? 1 : (camera.duration ?? 420)
  return {
    transform: `translate3d(${camera.x}px, ${BASE_FRAME_Y + camera.y}px, 0) scale(${camera.scale})`,
    transformOrigin: camera.transformOrigin ?? '50% 55%',
    transition: reducedMotion
      ? 'none'
      : `transform ${duration}ms cubic-bezier(0.22, 0.8, 0.28, 1)`,
  }
}

type VanPreviewStageProps = {
  part: VanPart
  /** When true, crossfade the van composite with the camera move. */
  transitioning?: boolean
}

export function VanPreviewStage({ part, transitioning = false }: VanPreviewStageProps) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return (
    <div className="van-preview-viewport" aria-hidden={false}>
      <div className="van-preview-stage" style={cameraStyle(part.camera, reducedMotion)}>
        <div className="van-preview-scene">
          <img
            key={part.id}
            className={`van-preview-van${transitioning ? ' van-preview-van--switching' : ''}${reducedMotion ? ' van-preview-van--instant' : ''}`}
            src={part.vanSrc}
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

/**
 * Composites are full vans, so the beach drive-off swaps the van image
 * instead of layering a separate accessory. This component is unused for
 * composites but kept as a no-op export for App wiring compatibility.
 */
export function BeachVanAccessory(_props: BeachVanAccessoryProps) {
  return null
}
