import classNames from 'classnames'
import React, { useEffect, useMemo, useState } from 'react'

import { SentenceEntry } from '../../data/sentences'
import CommonProps from '../CommonProps'

import GoalSentence from './GoalSentence'
import UserSentence, {
  UserSentenceInputEvent,
  UserSentenceKeyDownEvent,
  UserSentenceResetEvent,
  UserSentenceSubmitEvent,
} from './UserSentence'
import styles from './index.module.scss'

export type TypingResult = {
  state: 'succeed' | 'fail' | 'reset' | 'type' | 'interval'
  userText: string
  strokeCount: number
  duration: number
}

type TypeBoardProps = CommonProps & {
  sentence: SentenceEntry
  index?: number
  enabled?: boolean
  lockTimeAfterFail?: number
  refreshInterval?: number
  onSucceed?: (result: TypingResult) => any
  onFail?: (result: TypingResult) => any
  onReset?: (result: TypingResult) => any
  onUpdate?: (result: TypingResult) => any
}

function TypeBoard({
  className,
  sentence: sentenceEntry,
  index,
  enabled = true,
  lockTimeAfterFail = 500,
  refreshInterval = 200,
  onSucceed = () => {},
  onFail = () => {},
  onReset = () => {},
  onUpdate = () => {},
}: TypeBoardProps) {
  const [locked, setLocked] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [userText, setUserText] = useState('')
  const [beginningTime, setBeginningTime] = useState(Date.now())
  const [strokeCount, setStrokeCount] = useState(0)

  const sentence = sentenceEntry.sentence
  const words = useMemo(() => sentence.split(/ |\u00b7/), [sentence])

  const typable = enabled && !locked

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (userText !== '' && typable) {
        onUpdate({
          strokeCount,
          userText,
          state: 'interval',
          duration: Date.now() - beginningTime,
        })
      }
    }, refreshInterval)

    return () => {
      window.clearInterval(interval)
    }
  }, [beginningTime, onUpdate, refreshInterval, strokeCount, typable, userText])

  useEffect(() => {
    if (resetting) {
      setLocked(false)
      setResetting(false)
    }
  }, [resetting])

  const lockAndResetInput = () => {
    setLocked(true)

    window.setTimeout(() => {
      setUserText('')
      setResetting(true)
    }, lockTimeAfterFail)
  }

  const handleUserTextInput = ({ value }: UserSentenceInputEvent) => {
    const currentWords = value.split(/ |\u00b7/)
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
      lockAndResetInput()
      onFail({
        strokeCount,
        state: 'fail',
        userText: value,
        duration: Date.now() - beginningTime,
      })
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
    if (!locked) {
      setUserText('')
      onReset({
        userText: value,
        strokeCount,
        state: 'reset',
        duration: Date.now() - beginningTime,
      })
    }
  }

  const handleUserTextKeyDown = ({ value }: UserSentenceKeyDownEvent) => {
    if (userText === '' && value === '') {
      setBeginningTime(Date.now())
      setStrokeCount(0)
    }

    setStrokeCount((v) => v + 1)
  }

  const handleUserTextSubmit = ({ value }: UserSentenceSubmitEvent) => {
    if (value === sentence) {
      setLocked(true)
      setResetting(true)
      setUserText('')
      onSucceed({
        strokeCount: strokeCount + 1,
        state: 'succeed',
        userText: value,
        duration: Date.now() - beginningTime,
      })
    } else if (value !== '') {
      lockAndResetInput()
      onFail({
        strokeCount: strokeCount + 1,
        state: 'fail',
        userText: value,
        duration: Date.now() - beginningTime,
      })
    }
  }

  return (
    <section className={classNames(className, styles.root)}>
      <GoalSentence
        {...sentenceEntry}
        index={index}
      />
      <UserSentence
        value={userText}
        autoFocus
        enabled={typable}
        onInput={handleUserTextInput}
        onReset={handleUserTextReset}
        onKeyDown={handleUserTextKeyDown}
        onSubmit={handleUserTextSubmit}
      />
    </section>
  )
}

export default TypeBoard
