import React, { useMemo, useState } from 'react'

import GoalSentence from './GoalSentence'
import UserSentence, {
  UserSentenceInputEvent,
  UserSentenceKeyDownEvent,
  UserSentenceResetEvent,
} from './UserSentence'

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

  const handleUserTextInput = ({ value }: UserSentenceInputEvent) => {
    const currentWords = value.split(' ')
    const lastComparableWordIndex = currentWords.length - 2

    setUserText(value)

    onUpdate({
      strokeCount,
      state: 'type',
      userText: value,
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
        userText: value,
        duration: Date.now() - beginningTime,
      })
      window.setTimeout(() => {
        setUserText('')
        setLocked(false)
      }, lockTimeAfterFail)
    } else if (value === sentence + ' ') {
      setUserText('')
      onSucceed({
        strokeCount,
        state: 'succeed',
        userText: value,
        duration: Date.now() - beginningTime,
      })
    }
  }

  const handleUserTextReset = ({ value }: UserSentenceResetEvent) => {
    setUserText('')
    setLocked(false)
    onReset({
      userText: value,
      strokeCount,
      state: 'reset',
      duration: Date.now() - beginningTime,
    })
  }

  const handleUserTextKeyDown = ({ value }: UserSentenceKeyDownEvent) => {
    if (userText === '' && value === '') {
      setBeginningTime(Date.now())
      setStrokeCount(0)
    }

    setStrokeCount((v) => v + 1)
  }

  return (
    <div>
      <GoalSentence sentence={sentence} />
      <UserSentence
        value={userText}
        autoFocus
        enabled={typable}
        onInput={handleUserTextInput}
        onReset={handleUserTextReset}
        onKeyDown={handleUserTextKeyDown}
      />
    </div>
  )
}

export default TypeBoard
