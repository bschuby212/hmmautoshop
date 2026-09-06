import { vanParts, type VanPart } from '../data/vanParts'

type PartPickerProps = {
  parts: VanPart[]
  activePartId: string
  onSelect: (index: number) => void
  disabled?: boolean
}

/** Tappable product tray — clearer than arrows for browsing parts. */
export function PartPicker({
  parts,
  activePartId,
  onSelect,
  disabled = false,
}: PartPickerProps) {
  return (
    <div className="part-picker" role="listbox" aria-label="Van parts">
      {parts.map((part, index) => {
        const selected = part.id === activePartId
        return (
          <button
            key={part.id}
            type="button"
            role="option"
            aria-selected={selected}
            className={`part-picker-item${selected ? ' part-picker-item--selected' : ''}`}
            onClick={() => onSelect(index)}
            disabled={disabled}
          >
            <span className="part-picker-thumb">
              <img src={part.partSrc} alt="" draggable={false} />
            </span>
            <span className="part-picker-label">{part.name}</span>
          </button>
        )
      })}
    </div>
  )
}

export function partCountLabel(index: number): string {
  return `${index + 1} of ${vanParts.length}`
}
