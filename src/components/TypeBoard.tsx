import React, { useMemo, useState } from 'react'

import invalidKeys from '../core/keys/invalidKeys'
import resetKeys from '../core/keys/resetKeys'
import zeroStrokeKeys from '../core/keys/zeroStrokeKeys'

export type TypingResult = {
  state: 'succeed' | 'fail' | 'reset' | 'type'
  userText: string
  strokeCount: number
  duration: number
}

type TypeBoardProps = {
  sentence: string
  enabled?: boolean
  lockTimeAfterFail?: number
  onSucceed?: (result: TypingResult) => any
  onFail?: (result: TypingResult) => any
  onReset?: (result: TypingResult) => any
  onUpdate?: (result: TypingResult) => any
}

function TypeBoard({
  sentence,
  enabled = true,
  lockTimeAfterFail = 500,
  onSucceed = () => {},
  onFail = () => {},
  onReset = () => {},
  onUpdate = () => {},
}: TypeBoardProps) {
  const [locked, setLocked] = useState(false)
  const [userText, setUserText] = useState('')
  const [beginningTime, setBeginningTime] = useState(Date.now())
  const [strokeCount, setStrokeCount] = useState(0)

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

    onUpdate({
      strokeCount,
      state: 'type',
      userText: currentUserText,
      duration: Date.now() - beginningTime,
    })

    if (lastComparableWordIndex < 0) {
      return
    }

    const enteredWord = currentWords[lastComparableWordIndex]
    const expectedWord = words[lastComparableWordIndex]

    if (enteredWord !== expectedWord) {
      setLocked(true)
      onFail({
        strokeCount,
        state: 'fail',
        userText: currentUserText,
        duration: Date.now() - beginningTime,
      })
      window.setTimeout(() => {
        setUserText('')
        setLocked(false)
      }, lockTimeAfterFail)
    } else if (currentUserText === sentence + ' ') {
      setUserText('')
      onSucceed({
        strokeCount,
        state: 'succeed',
        userText: currentUserText,
        duration: Date.now() - beginningTime,
      })
    }
  }

  const handleUserTextKeyUp = (event: React.KeyboardEvent) => {
    if (typable && resetKeys.has(event.code)) {
      setUserText('')
      setLocked(false)
      onReset({
        userText,
        strokeCount,
        state: 'reset',
        duration: Date.now() - beginningTime,
      })
    }
  }

  const handleUserTextKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (typable) {
      if (userText === '' && event.target.value === '') {
        setBeginningTime(Date.now())
        setStrokeCount(0)
      }

      if (invalidKeys.has(event.code) || event.ctrlKey || event.metaKey) {
        event.preventDefault()
      }

      if (!zeroStrokeKeys.has(event.code)) {
        setStrokeCount((v) => v + 1)
      }
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
