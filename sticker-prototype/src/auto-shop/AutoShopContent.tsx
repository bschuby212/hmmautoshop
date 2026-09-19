import { useState } from 'react'
import { vanParts, type VanPart } from '../data/vanParts'
import { AddToVanButton } from './AddToVanButton'
import { autoShopSign, garageBackground } from './autoShopAssets'
import { PartDots } from './PartDots'
import { PartNavigation } from './PartNavigation'
import { VanPreviewStage } from './VanPreviewStage'
import './AutoShop.css'

type AutoShopContentProps = {
  onFinish: (part: VanPart) => void
  onClose: () => void
}

export function AutoShopContent({
  onFinish,
  onClose,
}: AutoShopContentProps) {
  const [activePartIndex, setActivePartIndex] = useState(Math.min(1, vanParts.length - 1))
  const [placedPart, setPlacedPart] = useState<VanPart | null>(null)
  const [mode, setMode] = useState<'select' | 'installed' | 'driving'>('select')
  const total = vanParts.length
  const activePart = vanParts[activePartIndex] ?? vanParts[0]
  const displayedPart = placedPart ?? activePart
  const isSelecting = mode === 'select'
  const isDriving = mode === 'driving'

  const goToIndex = (nextIndex: number) => {
    if (!isSelecting || total === 0) return
    const wrapped = ((nextIndex % total) + total) % total
    if (wrapped === activePartIndex) return
    setActivePartIndex(wrapped)
  }

  const handlePlace = () => {
    if (!isSelecting) return
    setPlacedPart(activePart)
    setMode('installed')
  }

  const handleChange = () => {
    setMode('select')
    setPlacedPart(null)
  }

  const handleFinish = () => {
    if (!placedPart || isDriving) return
    setMode('driving')
  }

  return (
    <div
      className={`auto-shop auto-shop--${mode} selection-screen selection-screen--sheet selection-screen--sheet-open`}
    >
      <img
        className="auto-shop-garage-bg"
        src={garageBackground}
        alt=""
        draggable={false}
        decoding="async"
        fetchPriority="high"
        aria-hidden="true"
      />

      <header className="auto-shop-sign" aria-label="Auto Shop">
        <div className="auto-shop-sign-plate" aria-hidden="true">
          <img src={autoShopSign} alt="" draggable={false} decoding="async" />
        </div>
        <h1 className="auto-shop-sign-title">Auto Shop</h1>
      </header>

      <div className="auto-shop-layout">
        <VanPreviewStage
          parts={vanParts}
          activeIndex={activePartIndex}
          onChangeIndex={goToIndex}
          swipeDisabled={!isSelecting}
          frozen={!isSelecting}
          driving={isDriving}
          onDriveOffComplete={() => onFinish(displayedPart)}
        />

        <div className={`auto-shop-footer${isDriving ? ' auto-shop-footer--driving' : ''}`}>
          <div className="auto-shop-footer-scrim" aria-hidden="true" />
          <div className="auto-shop-footer-content">
            <PartDots
              total={total}
              activeIndex={activePartIndex}
              onSelect={goToIndex}
              disabled={!isSelecting}
            />

            <PartNavigation
              partName={displayedPart.name}
              partDescription={displayedPart.description}
              partId={displayedPart.id}
            />

            <div className="auto-shop-actions">
              {isSelecting ? (
                <>
                  <AddToVanButton onClick={handlePlace} />
                  <button
                    type="button"
                    className="auto-shop-save-for-later"
                    onClick={onClose}
                  >
                    Save for Later
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="auto-shop-finish"
                    onClick={handleFinish}
                    disabled={isDriving}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="auto-shop-change"
                    onClick={handleChange}
                    disabled={isDriving}
                  >
                    Change Car Part
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
