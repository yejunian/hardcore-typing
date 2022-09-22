import React from 'react'

import styles from './GoalSentence.module.scss'

type GoalSentenceProps = {
  children?: React.ReactNode
  sentence?: string
  reference?: string
  index?: number
}

function GoalSentence({
  children,
  sentence,
  reference,
  index,
}: GoalSentenceProps) {
  return (
    <section className={styles.root}>
      {typeof index === 'number' && (
        <div className={styles.index}>#{index + 1}</div>
      )}
      <div className={styles.sentence}>{children ?? sentence}</div>
      {reference && <div className={styles.reference}>&mdash; {reference}</div>}
    </section>
  )
}

export default GoalSentence
