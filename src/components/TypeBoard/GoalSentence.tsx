import React from 'react'

import styles from './GoalSentence.module.scss'

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
    <section className={styles.root}>
      {typeof index === 'number' && (
        <div className={styles.index}>#{index + 1}</div>
      )}
      <div className={styles.sentence}>{sentence}</div>
      <div className={styles.reference}>&mdash; {reference}</div>
    </section>
  )
}

export default GoalSentence
