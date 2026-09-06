import { useEffect, useRef, useState } from 'react'
import { vanParts, type VanPart } from '../data/vanParts'
import garageBackground from '../assets/auto-shop/garage-bg.jpg'
import autoShopSign from '../assets/auto-shop/auto-shop-sign.png'
import { AddToVanButton } from './AddToVanButton'
import { PartDots } from './PartDots'
import { PartNavigation } from './PartNavigation'
import { VanPreviewStage } from './VanPreviewStage'
import './AutoShop.css'

export { garageBackground }

type AutoShopContentProps = {
  onAddToVan: (part: VanPart) => void
  onClose: () => void
  isConfirming?: boolean
}

export function AutoShopContent({
  onAddToVan,
  onClose,
  isConfirming = false,
}: AutoShopContentProps) {
  const [activePartIndex, setActivePartIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const transitionTimer = useRef<number | null>(null)
  const total = vanParts.length
  const activePart = vanParts[activePartIndex] ?? vanParts[0]

  useEffect(() => {
    return () => {
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current)
    }
  }, [])

  const goToIndex = (nextIndex: number) => {
    if (isConfirming || total === 0) return
    const wrapped = ((nextIndex % total) + total) % total
    if (wrapped === activePartIndex) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current)

    setActivePartIndex(wrapped)
    if (reducedMotion) {
      setIsTransitioning(false)
      return
    }

    setIsTransitioning(true)
    const duration = vanParts[wrapped]?.camera.duration ?? 480
    transitionTimer.current = window.setTimeout(() => {
      setIsTransitioning(false)
      transitionTimer.current = null
    }, duration)
  }

  const handlePrevious = () => goToIndex(activePartIndex - 1)
  const handleNext = () => goToIndex(activePartIndex + 1)

  const handleAdd = () => {
    if (isConfirming) return
    onAddToVan(activePart)
  }

  return (
    <div className="auto-shop selection-screen selection-screen--sheet selection-screen--sheet-open">
      {/* Figma 17545:4192 — garage bg scaled larger than the phone (485×1048 at -22,-196). */}
      <img
        className="auto-shop-garage-bg"
        src={garageBackground}
        alt=""
        draggable={false}
        aria-hidden="true"
      />

      {/* Figma 17545:4167 + 17545:4168 — metal plate overlay + title, not baked into garage. */}
      <header className="auto-shop-sign" aria-label="Auto Shop">
        <div className="auto-shop-sign-plate" aria-hidden="true">
          <img src={autoShopSign} alt="" draggable={false} />
        </div>
        <h1 className="auto-shop-sign-title">Auto Shop</h1>
      </header>

      <div className="auto-shop-layout">
        <VanPreviewStage
          part={activePart}
          transitioning={isTransitioning}
          onSwipePrevious={handlePrevious}
          onSwipeNext={handleNext}
          swipeDisabled={isConfirming}
        />

        <div className="auto-shop-footer">
          <div className="auto-shop-footer-scrim" aria-hidden="true" />
          <div className="auto-shop-footer-content">
            <PartDots
              total={total}
              activeIndex={activePartIndex}
              onSelect={goToIndex}
              disabled={isConfirming}
            />

            <PartNavigation
              partName={activePart.name}
              partDescription={activePart.description}
            />

            <div className="auto-shop-actions">
              <AddToVanButton
                onClick={handleAdd}
                confirming={isConfirming}
                disabled={isConfirming}
              />
              <button
                type="button"
                className="auto-shop-save-for-later"
                onClick={onClose}
                disabled={isConfirming}
              >
                Save for Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
