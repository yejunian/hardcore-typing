import React from 'react'

import invalidKeys from '../../core/keys/invalidKeys'
import resetKeys from '../../core/keys/resetKeys'
import submitKeys from '../../core/keys/submitKeys'
import zeroStrokeKeys from '../../core/keys/zeroStrokeKeys'

import styles from './UserSentence.module.scss'

export type UserSentenceProps = {
  value: string
  autoFocus?: boolean
  enabled?: boolean
  onInput?: (param: UserSentenceInputEvent) => void
  onReset?: (param: UserSentenceResetEvent) => void
  onKeyDown?: (param: UserSentenceKeyDownEvent) => void
  onSubmit?: (param: UserSentenceSubmitEvent) => void
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
}

export type UserSentenceSubmitEvent = {
  value: string
}

function UserSentence({
  value,
  autoFocus = false,
  enabled = true,
  onInput,
  onReset,
  onKeyDown,
  onSubmit,
}: UserSentenceProps) {
  let lastLocalValue = value

  const handleUserTextInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const currentUserText = event.currentTarget.value

    if (enabled && onInput && currentUserText !== ' ') {
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

      if (onSubmit && submitKeys.has(event.code)) {
        event.preventDefault()
        onSubmit({
          value: lastLocalValue,
        })
      }

      if (
        onKeyDown &&
        !zeroStrokeKeys.has(event.code) &&
        !submitKeys.has(event.code)
      ) {
        onKeyDown({
          code: event.code,
          value: lastLocalValue,
        })
      }
    }
  }

  const handleUserTextKeyUp = (event: React.KeyboardEvent) => {
    if (enabled && onReset && resetKeys.has(event.code)) {
      onReset({ value: lastLocalValue })
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
