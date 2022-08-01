import React, { useMemo, useState } from 'react'

type TypeBoardProps = {
  sentence: string
  enabled?: boolean
  onCompleteCorrectly?: (userText: string) => any
  onEnterWrong?: (userText: string) => any
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
  onCompleteCorrectly = () => {},
  onEnterWrong = () => {},
  onReset = () => {},
}: TypeBoardProps) {
  const [userText, setUserText] = useState('')
  const words = useMemo(() => sentence.split(' '), [sentence])

  const handleUserTextInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (!enabled) {
      return
    }

    const currentUserText = event.currentTarget.value

    const currentWords = currentUserText.split(' ')
    const lastComparableWordIndex = currentWords.length - 2

    setUserText(currentUserText)

    if (lastComparableWordIndex < 0) {
      return
    }

    if (
      currentWords[lastComparableWordIndex] !== words[lastComparableWordIndex]
    ) {
      onEnterWrong(userText)
    } else if (currentUserText === sentence + ' ') {
      setUserText('')
      onCompleteCorrectly(userText)
    }
  }

  const handleUserTextKeyUp = (event: React.KeyboardEvent) => {
    if (resetKeys.has(event.code)) {
      setUserText('')
      onReset(userText)
    }
  }

  const handleUserTextKeyDown = (event: React.KeyboardEvent) => {
    if (invalidKeys.has(event.code) || event.ctrlKey || event.metaKey) {
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
