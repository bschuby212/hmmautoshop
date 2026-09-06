type AddToVanButtonProps = {
  onClick: () => void
  disabled?: boolean
  confirming?: boolean
}

export function AddToVanButton({
  onClick,
  disabled = false,
  confirming = false,
}: AddToVanButtonProps) {
  return (
    <button
      type="button"
      className="add-to-van-button"
      onClick={onClick}
      disabled={disabled || confirming}
      aria-busy={confirming || undefined}
    >
      {confirming ? 'Adding…' : 'Add to Van'}
    </button>
  )
}
