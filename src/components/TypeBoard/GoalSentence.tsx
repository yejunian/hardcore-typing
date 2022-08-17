import React from 'react'

type GoalSentenceProps = {
  sentence: string
  reference: string
}

function GoalSentence({
  sentence,
  reference,
}: GoalSentenceProps) {
  return (
    <div>
      <p>{sentence}</p>
      <p>&mdash; {reference}</p>
    </div>
  )
}

export default GoalSentence
