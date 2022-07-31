import React, { useMemo, useState } from 'react'

type TypeBoardProps = {
  sentence: string
  onCompleteCorrectly?: (userText: string) => any
  onEnterWrong?: (userText: string) => any
}

function TypeBoard({
  sentence,
  onCompleteCorrectly = () => {},
  onEnterWrong = () => {},
}: TypeBoardProps) {
  const [userText, setUserText] = useState('')
  const words = useMemo(() => sentence.split(' '), [sentence])

  const handleUserTextInput = (event: React.FormEvent<HTMLInputElement>) => {
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
      setUserText('')
      onEnterWrong(userText)
    } else if (currentUserText === sentence + ' ') {
      setUserText('')
      onCompleteCorrectly(userText)
    }
  }

  return (
    <div>
      <div>{sentence}</div>
      <input
        type="text"
        autoFocus
        value={userText}
        onInput={handleUserTextInput}
      />
    </div>
  )
}

export default TypeBoard
