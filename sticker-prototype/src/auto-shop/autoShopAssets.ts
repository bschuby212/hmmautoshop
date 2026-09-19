import garageBackground from '../assets/auto-shop/garage-sheet-bg.png'
import autoShopSign from '../assets/auto-shop/auto-shop-sign.png'
import { vanParts } from '../data/vanParts'

export { autoShopSign, garageBackground }

const autoShopImageSources = [
  garageBackground,
  autoShopSign,
  ...vanParts.flatMap((part) => part.shopLayers.map((layer) => layer.src)),
]

let preloadPromise: Promise<void> | null = null

function decodeImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image()
    image.decoding = 'async'
    let settled = false

    const finish = () => {
      if (settled) return
      settled = true
      if (typeof image.decode !== 'function') {
        resolve()
        return
      }
      image.decode().catch(() => undefined).finally(resolve)
    }

    image.addEventListener('load', finish, { once: true })
    image.addEventListener('error', () => resolve(), { once: true })
    image.src = src

    if (image.complete) finish()
  })
}

/** Warm every bitmap used during selection and confirmation before it animates. */
export function preloadAutoShopAssets() {
  if (typeof Image === 'undefined') return Promise.resolve()
  if (!preloadPromise) {
    preloadPromise = Promise.all(autoShopImageSources.map(decodeImage)).then(() => undefined)
  }
  return preloadPromise
}
