import { useEffect, useRef, useState } from 'react'
import { vanParts, type VanPart } from '../data/vanParts'
import garageBackground from '../assets/auto-shop/garage-bg.jpg'
import { AddToVanButton } from './AddToVanButton'
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
    const duration = vanParts[wrapped]?.camera.duration ?? 520
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
    <div
      className="auto-shop selection-screen selection-screen--sheet selection-screen--sheet-open"
      style={{ backgroundImage: `url(${garageBackground})` }}
    >
      <div className="auto-shop-layout">
        <header className="auto-shop-header">
          <h1 className="auto-shop-title">Auto Shop</h1>
          <button
            type="button"
            className="auto-shop-close"
            aria-label="Close Auto Shop"
            onClick={onClose}
            disabled={isConfirming}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <VanPreviewStage part={activePart} transitioning={isTransitioning} />

        <PartNavigation
          partName={activePart.name}
          partDescription={activePart.description}
          positionLabel={`${activePartIndex + 1} of ${total}`}
          onPrevious={handlePrevious}
          onNext={handleNext}
          disabled={isConfirming}
        />

        <div className="auto-shop-actions">
          <AddToVanButton
            onClick={handleAdd}
            confirming={isConfirming}
            disabled={isConfirming}
          />
        </div>
      </div>
    </div>
  )
}
