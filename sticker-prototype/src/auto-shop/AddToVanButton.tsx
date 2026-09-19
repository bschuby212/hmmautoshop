type AddToVanButtonProps = {
  onClick: () => void
  disabled?: boolean
}

export function AddToVanButton({
  onClick,
  disabled = false,
}: AddToVanButtonProps) {
  return (
    <button
      type="button"
      className="add-to-van-button"
      onClick={onClick}
      disabled={disabled}
    >
      Place
    </button>
  )
}
