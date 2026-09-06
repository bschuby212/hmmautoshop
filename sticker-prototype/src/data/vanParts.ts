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
 * Figma shop crop on a 393px phone — absolute px, not % of a padded parent.
 * Image fills the box with object-fit: cover.
 */
export type VanPartShopFrame = {
  widthPx: number
  leftPx: number
  heightPx: number
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
  /** Framing for shopSrc inside the 393px phone stage. */
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
 * Exact Figma 17547:4065 boxes (phone 393px):
 * - bike rack: left 63 / top 280 / 547×248
 * - kayak:     left 25 / top 336 / 341×198
 * - eyelashes: left -174 / top 296 / 495×248
 * topPx is relative to the bike-rack baseline (280).
 */
export const vanParts: VanPart[] = [
  {
    id: 'bike-rack',
    name: 'Bike rack',
    description: 'Rear hitch mount that carries two bikes for the trail.',
    partSrc: bikeRackPart,
    shopSrc: shopBikeRack,
    shopFrame: { widthPx: 547, leftPx: 63, heightPx: 248, topPx: 0 },
    vanSrc: bikeRackVan,
    camera: stillCamera,
  },
  {
    id: 'kayak',
    name: 'Kayak',
    description: 'Roof straps that lock a kayak on for water days.',
    partSrc: kayakPart,
    shopSrc: shopKayak,
    shopFrame: { widthPx: 341, leftPx: 25, heightPx: 198, topPx: 56 },
    vanSrc: kayakVan,
    camera: stillCamera,
  },
  {
    id: 'eyelashes',
    name: 'Eyelashes',
    description: 'Headlight decals that give the van a little personality.',
    partSrc: eyelashesPart,
    shopSrc: shopEyelashes,
    shopFrame: { widthPx: 495, leftPx: -174, heightPx: 248, topPx: 16 },
    vanSrc: eyelashesVan,
    camera: stillCamera,
  },
]

export function getVanPartById(id: string): VanPart | undefined {
  return vanParts.find((part) => part.id === id)
}
