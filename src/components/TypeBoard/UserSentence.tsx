import React from 'react'

import invalidKeys from '../../core/keys/invalidKeys'
import resetKeys from '../../core/keys/resetKeys'
import zeroStrokeKeys from '../../core/keys/zeroStrokeKeys'

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
}

function UserSentence({
  value,
  autoFocus = false,
  enabled = true,
  onInput,
  onReset,
  onKeyDown,
}: UserSentenceProps) {
  let lastLocalValue = value

  const handleUserTextInput = (event: React.FormEvent<HTMLInputElement>) => {
    const currentUserText = event.currentTarget.value

    if (enabled && onInput && currentUserText !== ' ') {
      lastLocalValue = currentUserText
      onInput({ value: lastLocalValue })
    }
  }

  const handleUserTextKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (enabled) {
      if (invalidKeys.has(event.code) || event.ctrlKey || event.metaKey) {
        event.preventDefault()
      }

      if (onKeyDown && !zeroStrokeKeys.has(event.code)) {
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

  const handleUserTextClick = (event: React.MouseEvent<HTMLInputElement>) => {
    const length = event.currentTarget.value.length
    event.currentTarget.setSelectionRange(length, length)
  }

  return (
    <input
      type="text"
      autoFocus={autoFocus}
      value={value}
      onInput={handleUserTextInput}
      onKeyDown={handleUserTextKeyDown}
      onKeyUp={handleUserTextKeyUp}
      onClick={handleUserTextClick}
    />
  )
}

export default UserSentence
