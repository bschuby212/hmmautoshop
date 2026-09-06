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
  description: string
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
 *
 * Base van paint sits roughly at x 12–87%, y 41–77% of the padded asset.
 */
export const vanParts: VanPart[] = [
  {
    id: 'roof-rack',
    name: 'Roof rack',
    description: 'Sturdy crossbars for gear, boxes, and weekend cargo.',
    imageSrc: roofRack,
    accessory: { width: '54%', x: '23%', y: '40.2%', anchor: 'top left' },
    camera: { scale: 1.02, x: 0, y: 8, transformOrigin: '50% 42%', duration: 480 },
    beachPlacement: { width: '50%', x: '24%', y: '8%', anchor: 'top left' },
  },
  {
    id: 'bike-rack',
    name: 'Bike rack',
    description: 'Rear hitch mount that carries two bikes for the trail.',
    imageSrc: bikeRack,
    accessory: { width: '15%', x: '6.2%', y: '45.2%', anchor: 'top left' },
    camera: { scale: 1.04, x: 16, y: 2, transformOrigin: '22% 55%', duration: 500 },
    beachPlacement: { width: '16%', x: '5%', y: '30%', anchor: 'top left' },
  },
  {
    id: 'solar-panels',
    name: 'Solar panels',
    description: 'Roof panels that keep your battery topped up off-grid.',
    imageSrc: solarPanels,
    accessory: { width: '56%', x: '22%', y: '40.5%', anchor: 'top left' },
    camera: { scale: 1.02, x: 0, y: 10, transformOrigin: '50% 40%', duration: 480 },
    beachPlacement: { width: '52%', x: '23%', y: '10%', anchor: 'top left' },
  },
  {
    id: 'ski-rack',
    name: 'Ski rack',
    description: 'Clamped roof mount for skis and poles on snowy trips.',
    imageSrc: skiRack,
    accessory: { width: '52%', x: '24%', y: '40%', anchor: 'top left' },
    camera: { scale: 1.02, x: -4, y: 8, transformOrigin: '48% 40%', duration: 480 },
    beachPlacement: { width: '48%', x: '25%', y: '9%', anchor: 'top left' },
  },
  {
    id: 'surfboard-and-rack',
    name: 'Surfboard and rack',
    description: 'Side-mount rack with a board ready for the next break.',
    imageSrc: surfboardAndRack,
    accessory: { width: '50%', x: '24%', y: '35.5%', anchor: 'top left' },
    camera: { scale: 1.03, x: 4, y: 10, transformOrigin: '50% 38%', duration: 490 },
    beachPlacement: { width: '48%', x: '24%', y: '5%', anchor: 'top left' },
  },
  {
    id: 'rally-lights',
    name: 'Rally lights',
    description: 'Bright front lights for early drives and foggy roads.',
    imageSrc: rallyLights,
    accessory: { width: '7%', x: '83.5%', y: '53.5%', anchor: 'top left' },
    camera: { scale: 1.04, x: -16, y: -2, transformOrigin: '80% 56%', duration: 500 },
    beachPlacement: { width: '8%', x: '82.5%', y: '43%', anchor: 'top left' },
  },
  {
    id: 'eyelashes',
    name: 'Eyelashes',
    description: 'Playful lash decals that give the headlights some charm.',
    imageSrc: eyelashes,
    accessory: { width: '8%', x: '83%', y: '51.5%', anchor: 'top left' },
    camera: { scale: 1.04, x: -18, y: 0, transformOrigin: '82% 54%', duration: 500 },
    beachPlacement: { width: '9%', x: '82.5%', y: '41%', anchor: 'top left' },
  },
  {
    id: 'mustache',
    name: 'Mustache',
    description: 'A classic front bumper mustache with personality.',
    imageSrc: mustache,
    accessory: { width: '10%', x: '82%', y: '60.5%', anchor: 'top left' },
    camera: { scale: 1.04, x: -16, y: -6, transformOrigin: '80% 62%', duration: 500 },
    beachPlacement: { width: '11%', x: '81%', y: '53%', anchor: 'top left' },
  },
  {
    id: 'mustache-front',
    name: 'Front mustache',
    description: 'A wider grille mustache for a bigger, bolder look.',
    imageSrc: mustacheFront,
    accessory: { width: '13%', x: '80%', y: '60.5%', anchor: 'top left' },
    camera: { scale: 1.04, x: -14, y: -6, transformOrigin: '80% 62%', duration: 500 },
    beachPlacement: { width: '14%', x: '79%', y: '53%', anchor: 'top left' },
  },
  {
    id: 'kayak',
    name: 'Kayak',
    description: 'A red kayak strapped to the roof for water days.',
    imageSrc: kayak,
    accessory: { width: '56%', x: '22%', y: '37%', anchor: 'top left' },
    camera: { scale: 1.02, x: 0, y: 10, transformOrigin: '50% 38%', duration: 490 },
    beachPlacement: { width: '52%', x: '23%', y: '5%', anchor: 'top left' },
  },
  {
    id: 'running-board',
    name: 'Running board',
    description: 'Side step board for easier climbs in and out.',
    imageSrc: runningBoard,
    accessory: { width: '40%', x: '30%', y: '68.5%', anchor: 'top left' },
    camera: { scale: 1.02, x: 0, y: -10, transformOrigin: '50% 72%', duration: 480 },
    beachPlacement: { width: '40%', x: '30%', y: '76%', anchor: 'top left' },
  },
]

export function getVanPartById(id: string): VanPart | undefined {
  return vanParts.find((part) => part.id === id)
}
