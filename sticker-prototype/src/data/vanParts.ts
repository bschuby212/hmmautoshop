import baseVan from '../assets/auto-shop/van/base-van.png'
import roofRack from '../assets/auto-shop/parts/roof-rack.png'
import bikeRack from '../assets/auto-shop/parts/bike-rack.png'
import solarPanels from '../assets/auto-shop/parts/solar-panels.png'
import skiRack from '../assets/auto-shop/parts/ski-rack.png'
import surfboardAndRack from '../assets/auto-shop/parts/surfboard-and-rack.png'
import rallyLights from '../assets/auto-shop/parts/rally-lights.png'
import eyelashes from '../assets/auto-shop/parts/eyelashes.png'
import mustache from '../assets/auto-shop/parts/mustache.png'
import mustacheFront from '../assets/auto-shop/parts/mustache-front.png'
import kayak from '../assets/auto-shop/parts/kayak.png'
import runningBoard from '../assets/auto-shop/parts/running-board.png'

export type VanPartPlacement = {
  /** Width as % of the van stage width */
  width: number | string
  /** Left offset as % of the van stage width */
  x: number | string
  /** Top offset as % of the van stage height */
  y: number | string
  anchor?: string
}

export type VanPartCamera = {
  scale: number
  x: number
  y: number
  transformOrigin?: string
  duration?: number
}

export type VanPart = {
  id: string
  name: string
  imageSrc: string
  beachImageSrc?: string
  vanView?: string
  accessory: VanPartPlacement
  camera: VanPartCamera
  beachPlacement?: VanPartPlacement
}

/** Side-profile base van used in the Auto Shop preview stage. */
export const autoShopBaseVanSrc = baseVan

/**
 * Parts browser configuration. Add a new uploaded asset by appending one entry —
 * UI, labels, overlay position, and camera all read from this array.
 *
 * Placement values are percentages of the van stage box so accessories stay
 * aligned while the stage scales and the camera pans/zooms.
 */
export const vanParts: VanPart[] = [
  {
    id: 'roof-rack',
    name: 'Roof rack',
    imageSrc: roofRack,
    accessory: { width: '58%', x: '21%', y: '28%', anchor: 'top left' },
    camera: { scale: 1.55, x: 0, y: 48, transformOrigin: '50% 32%', duration: 550 },
    beachPlacement: { width: '54%', x: '22%', y: '6%', anchor: 'top left' },
  },
  {
    id: 'bike-rack',
    name: 'Bike rack',
    imageSrc: bikeRack,
    accessory: { width: '16%', x: '1%', y: '40%', anchor: 'top left' },
    camera: { scale: 1.75, x: 110, y: -8, transformOrigin: '12% 55%', duration: 580 },
    beachPlacement: { width: '18%', x: '1%', y: '28%', anchor: 'top left' },
  },
  {
    id: 'solar-panels',
    name: 'Solar panels',
    imageSrc: solarPanels,
    accessory: { width: '62%', x: '19%', y: '31%', anchor: 'top left' },
    camera: { scale: 1.6, x: 0, y: 52, transformOrigin: '50% 30%', duration: 540 },
    beachPlacement: { width: '58%', x: '20%', y: '10%', anchor: 'top left' },
  },
  {
    id: 'ski-rack',
    name: 'Ski rack',
    imageSrc: skiRack,
    accessory: { width: '56%', x: '22%', y: '29%', anchor: 'top left' },
    camera: { scale: 1.58, x: -12, y: 50, transformOrigin: '48% 30%', duration: 540 },
    beachPlacement: { width: '52%', x: '23%', y: '8%', anchor: 'top left' },
  },
  {
    id: 'surfboard-and-rack',
    name: 'Surfboard and rack',
    imageSrc: surfboardAndRack,
    accessory: { width: '58%', x: '20%', y: '27%', anchor: 'top left' },
    camera: { scale: 1.62, x: 8, y: 54, transformOrigin: '50% 28%', duration: 560 },
    beachPlacement: { width: '54%', x: '21%', y: '4%', anchor: 'top left' },
  },
  {
    id: 'rally-lights',
    name: 'Rally lights',
    imageSrc: rallyLights,
    accessory: { width: '7%', x: '86%', y: '52%', anchor: 'top left' },
    camera: { scale: 1.85, x: -120, y: -4, transformOrigin: '88% 58%', duration: 600 },
    beachPlacement: { width: '8%', x: '84%', y: '42%', anchor: 'top left' },
  },
  {
    id: 'eyelashes',
    name: 'Eyelashes',
    imageSrc: eyelashes,
    accessory: { width: '8%', x: '86%', y: '50%', anchor: 'top left' },
    camera: { scale: 1.9, x: -130, y: 0, transformOrigin: '90% 54%', duration: 600 },
    beachPlacement: { width: '9%', x: '84%', y: '40%', anchor: 'top left' },
  },
  {
    id: 'mustache',
    name: 'Mustache',
    imageSrc: mustache,
    accessory: { width: '10%', x: '85%', y: '60%', anchor: 'top left' },
    camera: { scale: 1.85, x: -125, y: -18, transformOrigin: '88% 64%', duration: 580 },
    beachPlacement: { width: '11%', x: '83%', y: '52%', anchor: 'top left' },
  },
  {
    id: 'mustache-front',
    name: 'Front mustache',
    imageSrc: mustacheFront,
    accessory: { width: '16%', x: '81%', y: '60%', anchor: 'top left' },
    camera: { scale: 1.8, x: -118, y: -20, transformOrigin: '88% 64%', duration: 580 },
    beachPlacement: { width: '16%', x: '79%', y: '52%', anchor: 'top left' },
  },
  {
    id: 'kayak',
    name: 'Kayak',
    imageSrc: kayak,
    accessory: { width: '60%', x: '20%', y: '26%', anchor: 'top left' },
    camera: { scale: 1.6, x: 0, y: 56, transformOrigin: '50% 28%', duration: 560 },
    beachPlacement: { width: '56%', x: '21%', y: '3%', anchor: 'top left' },
  },
  {
    id: 'running-board',
    name: 'Running board',
    imageSrc: runningBoard,
    accessory: { width: '42%', x: '28%', y: '71%', anchor: 'top left' },
    camera: { scale: 1.55, x: 0, y: -70, transformOrigin: '50% 78%', duration: 550 },
    beachPlacement: { width: '42%', x: '28%', y: '78%', anchor: 'top left' },
  },
]

export function getVanPartById(id: string): VanPart | undefined {
  return vanParts.find((part) => part.id === id)
}
