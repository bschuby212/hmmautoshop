import { getVanPartById, type VanPart } from '../data/vanParts'

const EQUIPPED_PART_KEY = 'equippedVanPartId'

/** Thin persistence adapter so storage can later move to an account/backend. */
export function readEquippedPartId(): string | null {
  try {
    return sessionStorage.getItem(EQUIPPED_PART_KEY)
  } catch {
    return null
  }
}

export function writeEquippedPartId(id: string) {
  try {
    sessionStorage.setItem(EQUIPPED_PART_KEY, id)
  } catch {
    // Ignore quota / private-mode failures; UI still works for the session.
  }
}

export function readEquippedPart(): VanPart | null {
  const id = readEquippedPartId()
  if (!id) return null
  return getVanPartById(id) ?? null
}

export function saveEquippedPart(part: VanPart) {
  writeEquippedPartId(part.id)
}
