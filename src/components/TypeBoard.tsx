import React, { useMemo, useState } from 'react'

type TypeBoardProps = {
  sentence: string
  enabled?: boolean
  lockTimeAfterFail?: number
  onSucceed?: (userText: string) => any
  onFail?: (userText: string) => any
  onReset?: (userText: string) => any
}

const invalidKeys = new Set([
  'Backspace',
  'Tab',
  'Insert',
  'Delete',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
  'ArrowLeft',
])

const resetKeys = new Set([
  'Escape',
])

function TypeBoard({
  sentence,
  enabled = true,
  lockTimeAfterFail = 500,
  onSucceed = () => {},
  onFail = () => {},
  onReset = () => {},
}: TypeBoardProps) {
  const [locked, setLocked] = useState(false)
  const [userText, setUserText] = useState('')

  const words = useMemo(() => sentence.split(' '), [sentence])

  const typable = enabled && !locked

  const handleUserTextInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (!typable) {
      return
    }

    const currentUserText = event.currentTarget.value

    if (currentUserText === ' ') {
      return
    }

    const currentWords = currentUserText.split(' ')
    const lastComparableWordIndex = currentWords.length - 2

    setUserText(currentUserText)

    if (lastComparableWordIndex < 0) {
      return
    }

    const enteredWord = currentWords[lastComparableWordIndex]
    const expectedWord = words[lastComparableWordIndex]

    if (enteredWord !== expectedWord) {
      setLocked(true)
      onFail(userText)
      window.setTimeout(() => {
        setUserText('')
        setLocked(false)
      }, lockTimeAfterFail)
    } else if (currentUserText === sentence + ' ') {
      setUserText('')
      onSucceed(userText)
    }
  }

  const handleUserTextKeyUp = (event: React.KeyboardEvent) => {
    if (typable && resetKeys.has(event.code)) {
      setUserText('')
      setLocked(false)
      onReset(userText)
    }
  }

  const handleUserTextKeyDown = (event: React.KeyboardEvent) => {
    if (
      typable &&
      (invalidKeys.has(event.code) || event.ctrlKey || event.metaKey)
    ) {
      event.preventDefault()
    }
  }

  const handleUserTextClick = (event: React.MouseEvent<HTMLInputElement>) => {
    const length = event.currentTarget.value.length
    event.currentTarget.setSelectionRange(length, length)
  }

  return (
    <div>
      <div>{sentence}</div>
      <input
        type="text"
        autoFocus
        value={userText}
        onInput={handleUserTextInput}
        onKeyDown={handleUserTextKeyDown}
        onKeyUp={handleUserTextKeyUp}
        onClick={handleUserTextClick}
      />
    </div>
  )
}

export default TypeBoard
