import baseVan from '../assets/auto-shop/van/base-van.png'
import bikeRackVan from '../assets/auto-shop/van/bike-rack.png'
import kayakVan from '../assets/auto-shop/van/kayak.png'
import eyelashesVan from '../assets/auto-shop/van/eyelashes.png'
import fixedBaseVan from '../assets/auto-shop/van/fixed-base.png'
import fixedBikeRack from '../assets/auto-shop/van/fixed-bike-rack.png'
import fixedKayak from '../assets/auto-shop/van/fixed-kayak.png'
import fixedEyelashes from '../assets/auto-shop/van/fixed-eyelashes.png'

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
export type VanPartShopLayer = {
  src: string
  widthPx: number
  leftPx: number
  heightPx: number
  topPx: number
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
  /** Fixed Figma layers on a shared 393×188 canvas. */
  shopLayers: VanPartShopLayer[]
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

const fixedBaseLayer: VanPartShopLayer = {
  src: fixedBaseVan,
  leftPx: 34.7,
  topPx: 25.58,
  widthPx: 323.59,
  heightPx: 162.27,
}

export const vanParts: VanPart[] = [
  {
    id: 'bike-rack',
    name: 'Bike rack',
    description: 'Rear hitch mount that carries two bikes for the trail.',
    partSrc: fixedBikeRack,
    shopLayers: [
      fixedBaseLayer,
      {
        src: fixedBikeRack,
        leftPx: 0,
        topPx: 67.76,
        widthPx: 57.51,
        heightPx: 89.14,
      },
    ],
    vanSrc: bikeRackVan,
    camera: stillCamera,
  },
  {
    id: 'kayak',
    name: 'Kayak',
    description: 'Roof straps that lock a kayak on for water days.',
    partSrc: fixedKayak,
    shopLayers: [
      fixedBaseLayer,
      {
        src: fixedKayak,
        leftPx: 94.97,
        topPx: 0,
        widthPx: 207.23,
        heightPx: 54.27,
      },
    ],
    vanSrc: kayakVan,
    camera: stillCamera,
  },
  {
    id: 'eyelashes',
    name: 'Eyelashes',
    description: 'Headlight decals that give the van a little personality.',
    partSrc: fixedEyelashes,
    shopLayers: [
      fixedBaseLayer,
      {
        src: fixedEyelashes,
        leftPx: 328.78,
        topPx: 98.43,
        widthPx: 26.84,
        heightPx: 21.09,
      },
    ],
    vanSrc: eyelashesVan,
    camera: stillCamera,
  },
]

export function getVanPartById(id: string): VanPart | undefined {
  return vanParts.find((part) => part.id === id)
}
