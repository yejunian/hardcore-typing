import React, { useEffect, useState } from 'react'

import forbiddenKeys from '../../core/keys/forbiddenKeys'
import invalidKeys from '../../core/keys/invalidKeys'
import resetKeys from '../../core/keys/resetKeys'
import zeroStrokeKeys from '../../core/keys/zeroStrokeKeys'

import styles from './UserSentence.module.scss'

export type UserSentenceProps = {
  value: string
  autoFocus?: boolean
  enabled?: boolean
  onInput?: (param: UserSentenceInputEvent) => void
  onReset?: (param: UserSentenceResetEvent) => void
  onKeyDown?: (param: UserSentenceKeyDownEvent) => void
}

export type UserSentenceInputEvent = {
  value: string
}

export type UserSentenceResetEvent = {
  value: string
}

export type UserSentenceKeyDownEvent = {
  code: string
  value: string
  isFirstStroke: boolean
  isForbidden: boolean
}

function UserSentence({
  value,
  autoFocus = false,
  enabled = true,
  onInput,
  onReset,
  onKeyDown,
}: UserSentenceProps) {
  const [hasBeenStroked, setHasBeenStroked] = useState(false)

  let lastLocalStroked = hasBeenStroked
  let lastLocalValue = value

  useEffect(() => {
    if (value === '') {
      setHasBeenStroked(false)
    }
  }, [value])

  const handleUserTextInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const currentUserText = event.currentTarget.value

    if (
      enabled &&
      onInput &&
      currentUserText !== ' ' &&
      currentUserText !== '\n'
    ) {
      lastLocalValue = currentUserText
      onInput({ value: lastLocalValue })
    }
  }

  const handleUserTextKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (enabled) {
      if (invalidKeys.has(event.code) || event.ctrlKey || event.metaKey) {
        event.preventDefault()
      }

      const isComposingEnter =
        (event.code === 'Enter' || event.code === 'NumberEnter') &&
        event.nativeEvent.isComposing

      if (
        onKeyDown &&
        !event.repeat &&
        !zeroStrokeKeys.has(event.code) &&
        !isComposingEnter
      ) {
        const isForbidden = forbiddenKeys.has(event.code)

        onKeyDown({
          isForbidden,
          code: event.code,
          value: lastLocalValue,
          isFirstStroke: !lastLocalStroked,
        })

        if (!isForbidden) {
          lastLocalStroked = true
          setHasBeenStroked(true)
        }
      }
    }
  }

  const handleUserTextKeyUp = (event: React.KeyboardEvent) => {
    if (enabled && onReset && resetKeys.has(event.code)) {
      onReset({ value: lastLocalValue })

      lastLocalStroked = false
      setHasBeenStroked(false)
    }
  }

  const handleUserTextClick = (
    event: React.MouseEvent<HTMLTextAreaElement>
  ) => {
    const length = event.currentTarget.value.length
    event.currentTarget.setSelectionRange(length, length)
  }

  return (
    <section className={styles.root}>
      <textarea
        className={styles.sentence}
        autoFocus={autoFocus}
        value={value}
        placeholder="위 문장을 따라 입력하세요."
        onInput={handleUserTextInput}
        onKeyDown={handleUserTextKeyDown}
        onKeyUp={handleUserTextKeyUp}
        onClick={handleUserTextClick}
      />
    </section>
  )
}

export default UserSentence
