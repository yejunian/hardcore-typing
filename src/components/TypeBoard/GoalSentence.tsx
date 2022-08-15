import React from 'react'

type GoalSentenceProps = {
  sentence: string
}

function GoalSentence({
  sentence
}: GoalSentenceProps) {
  return (
    <div>
      {sentence}
    </div>
  )
}

export default GoalSentence
