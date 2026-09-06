import bikeRackPart from '../assets/auto-shop/parts/bike-rack.png'
import kayakPart from '../assets/auto-shop/parts/kayak.png'
import eyelashesPart from '../assets/auto-shop/parts/eyelashes.png'
import baseVan from '../assets/auto-shop/van/base-van.png'
import bikeRackVan from '../assets/auto-shop/van/bike-rack.png'
import kayakVan from '../assets/auto-shop/van/kayak.png'
import eyelashesVan from '../assets/auto-shop/van/eyelashes.png'

export type VanPartCamera = {
  /** Kept for timing hooks; always leave scale at 1 with no pan. */
  scale: number
  x: number
  y: number
  transformOrigin?: string
  duration?: number
}

/**
 * Each catalog entry has an isolated part product shot plus a full van composite.
 * The product shot is what you browse; the composite shows it equipped.
 */
export type VanPart = {
  id: string
  name: string
  description: string
  /** Isolated part art for the product tray / hero. */
  partSrc: string
  /** Full van + part composite for equipped preview and beach drive-off. */
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

export const vanParts: VanPart[] = [
  {
    id: 'bike-rack',
    name: 'Bike rack',
    description: 'Rear hitch mount that carries two bikes for the trail.',
    partSrc: bikeRackPart,
    vanSrc: bikeRackVan,
    camera: stillCamera,
  },
  {
    id: 'kayak',
    name: 'Kayak',
    description: 'A red kayak strapped to the roof for water days.',
    partSrc: kayakPart,
    vanSrc: kayakVan,
    camera: stillCamera,
  },
  {
    id: 'eyelashes',
    name: 'Eyelashes',
    description: 'Playful lash decals that give the headlights some charm.',
    partSrc: eyelashesPart,
    vanSrc: eyelashesVan,
    camera: stillCamera,
  },
]

export function getVanPartById(id: string): VanPart | undefined {
  return vanParts.find((part) => part.id === id)
}
