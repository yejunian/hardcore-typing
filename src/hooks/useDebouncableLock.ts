import { useState } from 'react'

function useDebouncableLock(
  lockTime: number,
  onUnlock: () => void,
): [boolean, boolean, () => void, () => void] {
  const [locked, setLocked] = useState(false)
  const [unlockable, setUnlockable] = useState(false)
  const [timeoutId, setTimeoutId] = useState(-1)

  const updateTimeout = () => {
    window.clearTimeout(timeoutId)

    const id = window.setTimeout(() => {
      setUnlockable(true)
    }, lockTime)

    setTimeoutId(id)
  }

  const lock = () => {
    setLocked(true)
    updateTimeout()
  }

  const unlock = () => {
    if (unlockable) {
      setLocked(false)
      setUnlockable(false)
      onUnlock()
    } else if (timeoutId > 0) {
      updateTimeout()
    }
  }

  return [locked, unlockable, lock, unlock]
}

export default useDebouncableLock
