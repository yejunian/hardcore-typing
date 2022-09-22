import classNames from 'classnames'
import React, { useEffect, useMemo, useState } from 'react'

import tokenizeString, {
  SentenceToken,
} from '../../core/utils/tokenizeSentence'
import { SentenceEntry } from '../../data/sentences'
import useDebouncableLock from '../../hooks/useDebouncableLock'
import CommonProps from '../CommonProps'

import GoalSentence from './GoalSentence'
import UserSentence, {
  UserSentenceInputEvent,
  UserSentenceKeyDownEvent,
  UserSentenceResetEvent,
} from './UserSentence'
import styles from './index.module.scss'

export type TypingResult = {
  state: 'succeed' | 'fail' | 'reset' | 'type' | 'interval'
  userText: string
  strokeCount: number
  duration: number
  isFailureCounted?: boolean
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
  lockTimeAfterFail = 800,
  refreshInterval = 200,
  onSucceed = () => {},
  onFail = () => {},
  onReset = () => {},
  onUpdate = () => {},
}: TypeBoardProps) {
  const [userText, setUserText] = useState('')
  const [userWords, setUserWords] = useState<SentenceToken[]>([])

  const [beginningTime, setBeginningTime] = useState(Infinity)
  const [strokeCount, setStrokeCount] = useState(0)

  const resetUserText = () => {
    setUserText('')
    setUserWords([])
  }

  const [locked, unlockable, lock, unlock] = useDebouncableLock(
    lockTimeAfterFail,
    resetUserText
  )

  const typable = enabled && !locked

  const sentence = sentenceEntry.sentence
  const words = useMemo(() => tokenizeString(sentence), [sentence])

  const highlightedGoalWords = useMemo<React.ReactNode>(() => {
    let border = userWords.length

    for (let i = 0; i < userWords.length; i += 1) {
      if (userWords[i].content !== words[i].content) {
        border = i
        break
      }
    }

    return (
      <>
        {words.map(({ content }, index) => {
          let className: string | undefined
          if (index < border) {
            className = styles['--pass']
          } else if (index === border && locked) {
            className = styles['--fail']
          } else {
            className = undefined
          }

          return (
            <span key={index} className={className}>
              {content}
            </span>
          )
        })}
      </>
    )
  }, [locked, userWords, words])

  useEffect(() => {
    const interval = window.setInterval(() => {
      const rawDuration = Date.now() - beginningTime
      const duration = rawDuration >= 0 ? rawDuration : 0

      if (userText !== '' && typable) {
        onUpdate({
          duration,
          strokeCount,
          userText,
          state: 'interval',
        })
      }
    }, refreshInterval)

    return () => {
      window.clearInterval(interval)
    }
  }, [beginningTime, onUpdate, refreshInterval, strokeCount, typable, userText])

  const handleUserTextInput = ({ value }: UserSentenceInputEvent) => {
    const currentWords = tokenizeString(value)
    const lastComparableWordIndex = currentWords.length - 2
    const rawDuration = Date.now() - beginningTime
    const duration = rawDuration >= 0 ? rawDuration : 0

    setUserText(value)
    setUserWords(currentWords)

    onUpdate({
      duration,
      strokeCount,
      state: 'type',
      userText: value,
    })

    if (lastComparableWordIndex < 0) {
      return
    }

    const lastIndex = currentWords.length - 1

    if (
      currentWords[lastIndex - 1]?.type === 'word' &&
      currentWords[lastIndex]?.type === 'separator'
    ) {
      const lengthCompletion = words.length < currentWords.length
      const wordEquality =
        currentWords[lastIndex - 1]?.content === words[lastIndex - 1]?.content
      const separatorEquality =
        currentWords[lastIndex]?.content === words[lastIndex]?.content

      if (!wordEquality || (!lengthCompletion && !separatorEquality)) {
        lock()
        onFail({
          duration,
          strokeCount,
          state: 'fail',
          userText: value,
        })

        setBeginningTime(Infinity)
      }

      if (value === sentence + ' ' || value === sentence + '\n') {
        resetUserText()
        onSucceed({
          duration,
          strokeCount,
          state: 'succeed',
          userText: value,
        })

        setBeginningTime(Infinity)
      }
    }
  }

  const handleUserTextReset = ({ value }: UserSentenceResetEvent) => {
    const rawDuration = Date.now() - beginningTime
    const duration = rawDuration >= 0 ? rawDuration : 0

    if (!locked || unlockable) {
      if (unlockable) {
        unlock()
      }

      resetUserText()
      onReset({
        duration,
        strokeCount,
        userText: value,
        state: 'reset',
        isFailureCounted: locked,
      })
    }
  }

  const handleUserTextKeyDown = ({
    isFirstStroke,
    isForbidden,
  }: UserSentenceKeyDownEvent) => {
    if (locked && !unlockable) {
      lock()
      return
    } else if (isFirstStroke) {
      setBeginningTime(Date.now())
      setStrokeCount(0)
    } else if (isForbidden) {
      setStrokeCount(0)
      return
    }

    setStrokeCount((v) => v + 1)
  }

  return (
    <section className={classNames(className, styles.root)}>
      <GoalSentence reference={sentenceEntry.reference} index={index}>
        {highlightedGoalWords}
      </GoalSentence>

      <UserSentence
        value={userText}
        autoFocus
        enabled={typable}
        failed={locked}
        rate={userText.length / (sentence.length || Infinity)}
        onInput={handleUserTextInput}
        onReset={handleUserTextReset}
        onKeyDown={handleUserTextKeyDown}
      />
    </section>
  )
}

export default TypeBoard
