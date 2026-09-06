type PartDotsProps = {
  total: number
  activeIndex: number
  onSelect?: (index: number) => void
  disabled?: boolean
}

/** Figma page dots under the van — swipe still drives browsing. */
export function PartDots({
  total,
  activeIndex,
  onSelect,
  disabled = false,
}: PartDotsProps) {
  if (total <= 1) return null

  return (
    <div className="part-dots" role="tablist" aria-label="Parts">
      {Array.from({ length: total }, (_, index) => {
        const selected = index === activeIndex
        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={`Part ${index + 1} of ${total}`}
            className={`part-dot${selected ? ' part-dot--active' : ''}`}
            onClick={() => onSelect?.(index)}
            disabled={disabled || selected}
          />
        )
      })}
    </div>
  )
}
