import classNames from 'classnames'
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
  failed?: boolean
  rate?: number
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
}

function UserSentence({
  value,
  autoFocus = false,
  enabled = true,
  failed = false,
  rate,
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

      if (forbiddenKeys.has(event.code)) {
        onReset && onReset({ value: lastLocalValue })

        lastLocalStroked = false
        setHasBeenStroked(false)

        return
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
        onKeyDown({
          code: event.code,
          value: lastLocalValue,
          isFirstStroke: !lastLocalStroked,
        })

        lastLocalStroked = true
        setHasBeenStroked(true)
      }
    } else if (onKeyDown) {
      onKeyDown({
        code: event.code,
        value: lastLocalValue,
        isFirstStroke: false,
      })
    }
  }

  const handleUserTextKeyUp = (event: React.KeyboardEvent) => {
    if (onReset && resetKeys.has(event.code)) {
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
    <section className={classNames(styles.root, failed && styles['--fail'])}>
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

      {typeof rate === 'number' && (
        <div className={styles.ratebar}>
          <div
            className={styles.rate}
            style={{ transform: `scaleX(${Math.max(Math.min(rate, 1), 0)})` }}
          />
        </div>
      )}
    </section>
  )
}

export default UserSentence
