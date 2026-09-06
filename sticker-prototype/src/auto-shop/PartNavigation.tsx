type PartNavigationProps = {
  partName: string
  partDescription: string
  positionLabel: string
  onPrevious: () => void
  onNext: () => void
  disabled?: boolean
}

export function PartNavigation({
  partName,
  partDescription,
  positionLabel,
  onPrevious,
  onNext,
  disabled = false,
}: PartNavigationProps) {
  return (
    <div className="part-navigation">
      <button
        type="button"
        className="part-nav-arrow"
        aria-label="Previous part"
        onClick={onPrevious}
        disabled={disabled}
      >
        <span aria-hidden="true">‹</span>
      </button>
      <div className="part-navigation-copy" aria-live="polite">
        <p className="part-navigation-name">{partName}</p>
        <p className="part-navigation-description">{partDescription}</p>
        <p className="part-navigation-position">{positionLabel}</p>
      </div>
      <button
        type="button"
        className="part-nav-arrow"
        aria-label="Next part"
        onClick={onNext}
        disabled={disabled}
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>
  )
}
