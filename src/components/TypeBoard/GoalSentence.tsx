import React from 'react'

type GoalSentenceProps = {
  sentence: string
  reference: string
  index?: number
}

function GoalSentence({
  sentence,
  reference,
  index,
}: GoalSentenceProps) {
  return (
    <div>
      {typeof index === 'number' && <div>#{index + 1}</div>}
      <p>{sentence}</p>
      <p>&mdash; {reference}</p>
    </div>
  )
}

export default GoalSentence
