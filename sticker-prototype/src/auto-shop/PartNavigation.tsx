import { useEffect, useState } from 'react'

type PartNavigationProps = {
  partName: string
  partDescription: string
  partId: string
}

/** Title + description with a soft crossfade when the active part changes. */
export function PartNavigation({ partName, partDescription, partId }: PartNavigationProps) {
  const [visible, setVisible] = useState(true)
  const [rendered, setRendered] = useState({ partName, partDescription, partId })

  useEffect(() => {
    if (partId === rendered.partId) {
      setRendered({ partName, partDescription, partId })
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setRendered({ partName, partDescription, partId })
      setVisible(true)
      return
    }

    setVisible(false)
    // Half of van crossfade (480ms): fade out, swap copy, fade in.
    const swapTimer = window.setTimeout(() => {
      setRendered({ partName, partDescription, partId })
      requestAnimationFrame(() => setVisible(true))
    }, 240)
    return () => window.clearTimeout(swapTimer)
  }, [partId, partName, partDescription, rendered.partId])

  return (
    <div
      className={`part-navigation${visible ? ' part-navigation--visible' : ''}`}
      aria-live="polite"
    >
      <p className="part-navigation-name">{rendered.partName}</p>
      <p className="part-navigation-description">{rendered.partDescription}</p>
    </div>
  )
}
