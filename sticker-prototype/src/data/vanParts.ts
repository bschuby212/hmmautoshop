import baseVan from '../assets/auto-shop/van/base-van.png'
import bikeRackVan from '../assets/auto-shop/van/bike-rack.png'
import kayakVan from '../assets/auto-shop/van/kayak.png'
import eyelashesVan from '../assets/auto-shop/van/eyelashes.png'

export type VanPartCamera = {
  scale: number
  x: number
  y: number
  transformOrigin?: string
  duration?: number
}

/**
 * Each part is a full composited side-view van (van + accessory already attached).
 * Swiping swaps the whole image — no overlay placement math.
 */
export type VanPart = {
  id: string
  name: string
  description: string
  /** Full van + part composite shown in Auto Shop and on the beach drive-off. */
  vanSrc: string
  camera: VanPartCamera
}

/** Stock van with no accessory equipped. */
export const autoShopBaseVanSrc = baseVan

export const vanParts: VanPart[] = [
  {
    id: 'bike-rack',
    name: 'Bike rack',
    description: 'Rear hitch mount that carries two bikes for the trail.',
    vanSrc: bikeRackVan,
    camera: { scale: 1, x: 4, y: 0, transformOrigin: '28% 55%', duration: 400 },
  },
  {
    id: 'kayak',
    name: 'Kayak',
    description: 'A red kayak strapped to the roof for water days.',
    vanSrc: kayakVan,
    camera: { scale: 1, x: 0, y: 2, transformOrigin: '50% 42%', duration: 390 },
  },
  {
    id: 'eyelashes',
    name: 'Eyelashes',
    description: 'Playful lash decals that give the headlights some charm.',
    vanSrc: eyelashesVan,
    camera: { scale: 1, x: -5, y: 0, transformOrigin: '80% 54%', duration: 400 },
  },
]

export function getVanPartById(id: string): VanPart | undefined {
  return vanParts.find((part) => part.id === id)
}
