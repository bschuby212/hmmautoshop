import { useEffect, useState, type CSSProperties } from 'react'
import {
  autoShopBaseVanSrc,
  type VanPart,
  type VanPartCamera,
  type VanPartPlacement,
} from '../data/vanParts'

function cssLength(value: number | string) {
  return typeof value === 'number' ? `${value}%` : value
}

function placementStyle(placement: VanPartPlacement): CSSProperties {
  return {
    width: cssLength(placement.width),
    left: cssLength(placement.x),
    top: cssLength(placement.y),
    transformOrigin: placement.anchor ?? 'top left',
  }
}

/** Seat the painted van on the garage lift rails.
 *  Base van art has ~23.5% transparent pad under the tires. */
const BASE_FRAME_Y = 96

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
  /** When true, fade the accessory in/out with the camera move. */
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
            className="van-preview-base"
            src={autoShopBaseVanSrc}
            alt=""
            draggable={false}
          />
          <img
            key={part.id}
            className={`van-preview-accessory${transitioning ? ' van-preview-accessory--switching' : ''}${reducedMotion ? ' van-preview-accessory--instant' : ''}`}
            src={part.imageSrc}
            alt=""
            draggable={false}
            style={placementStyle(part.accessory)}
          />
        </div>
      </div>
    </div>
  )
}

type BeachVanAccessoryProps = {
  part: VanPart
}

/** Accessory attached inside the existing drive-off van wrap (shares its transform). */
export function BeachVanAccessory({ part }: BeachVanAccessoryProps) {
  const placement = part.beachPlacement ?? part.accessory
  const src = part.beachImageSrc ?? part.imageSrc
  return (
    <img
      className="drive-off-accessory"
      src={src}
      alt=""
      draggable={false}
      style={placementStyle(placement)}
    />
  )
}
