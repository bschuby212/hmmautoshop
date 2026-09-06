type PartNavigationProps = {
  partName: string
  partDescription: string
}

/** Title + description only — browsing is via swipe on the van for now. */
export function PartNavigation({ partName, partDescription }: PartNavigationProps) {
  return (
    <div className="part-navigation" aria-live="polite">
      <p className="part-navigation-name">{partName}</p>
      <p className="part-navigation-description">{partDescription}</p>
    </div>
  )
}
