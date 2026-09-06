import bikeRackPart from '../assets/auto-shop/parts/bike-rack.png'
import kayakPart from '../assets/auto-shop/parts/kayak.png'
import eyelashesPart from '../assets/auto-shop/parts/eyelashes.png'
import baseVan from '../assets/auto-shop/van/base-van.png'
import bikeRackVan from '../assets/auto-shop/van/bike-rack.png'
import kayakVan from '../assets/auto-shop/van/kayak.png'
import eyelashesVan from '../assets/auto-shop/van/eyelashes.png'
import shopBikeRack from '../assets/auto-shop/van/shop-bike-rack.png'
import shopKayak from '../assets/auto-shop/van/shop-kayak.png'
import shopEyelashes from '../assets/auto-shop/van/shop-eyelashes.png'

export type VanPartCamera = {
  /** Kept for timing hooks; always leave scale at 1 with no pan. */
  scale: number
  x: number
  y: number
  transformOrigin?: string
  duration?: number
}

/**
 * How the shop preview image is framed in the phone (Figma crop per part).
 * Width/left are % of the 393px frame; top nudges vertical seating on the lift.
 */
export type VanPartShopFrame = {
  widthPercent: number
  leftPercent: number
  topPx?: number
}

/**
 * Each catalog entry has an isolated part product shot, a shop carousel frame,
 * and a full van composite for beach drive-off.
 */
export type VanPart = {
  id: string
  name: string
  description: string
  /** Isolated part art for product shots. */
  partSrc: string
  /** Auto Shop swipe preview (Figma angle/crop art). */
  shopSrc: string
  /** Framing for shopSrc inside the phone viewport. */
  shopFrame: VanPartShopFrame
  /** Full van + part composite for equipped beach drive-off. */
  vanSrc: string
  camera: VanPartCamera
}

/** Stock van with no accessory equipped. */
export const autoShopBaseVanSrc = baseVan

const stillCamera: VanPartCamera = {
  scale: 1,
  x: 0,
  y: 0,
  transformOrigin: '50% 50%',
  duration: 480,
}

/**
 * Order matches Figma 17547:4065 carousel: bike rack → kayak → eyelashes.
 * Shop frames keep each part’s crop focus, sized to a similar ~230px van height.
 */
export const vanParts: VanPart[] = [
  {
    id: 'bike-rack',
    name: 'Bike rack',
    description: 'Rear hitch mount that carries two bikes for the trail.',
    partSrc: bikeRackPart,
    shopSrc: shopBikeRack,
    // Rear-focused crop; width tuned so rendered height ≈ 230px.
    shopFrame: { widthPercent: 118, leftPercent: -2, topPx: 0 },
    vanSrc: bikeRackVan,
    camera: stillCamera,
  },
  {
    id: 'kayak',
    name: 'Kayak',
    description: 'Roof straps that lock a kayak on for water days.',
    partSrc: kayakPart,
    shopSrc: shopKayak,
    // Side profile, scaled up to match the other parts’ visual size.
    shopFrame: { widthPercent: 100, leftPercent: 0, topPx: 0 },
    vanSrc: kayakVan,
    camera: stillCamera,
  },
  {
    id: 'eyelashes',
    name: 'Eyelashes',
    description: 'Headlight decals that give the van a little personality.',
    partSrc: eyelashesPart,
    shopSrc: shopEyelashes,
    // Front-focused crop; width tuned so rendered height ≈ 230px.
    shopFrame: { widthPercent: 108, leftPercent: -28, topPx: 0 },
    vanSrc: eyelashesVan,
    camera: stillCamera,
  },
]

export function getVanPartById(id: string): VanPart | undefined {
  return vanParts.find((part) => part.id === id)
}
