import classNames from 'classnames'
import React from 'react'

import styles from './Retry.module.scss'

export type RetryProps = {
  className?: string
  failed: boolean
  unlockable: boolean
  onClick?: () => void
}

function Retry({
  className,
  failed = false,
  unlockable = false,
  onClick,
}: RetryProps) {
  return (
    <section
      className={classNames(
        className,
        styles.root,
        failed && styles['--fail'],
        failed && unlockable && styles['--unlockable']
      )}
      onClick={onClick}
    >
      <div className={styles.retryContents}>
        <div>다시 시도</div>
        <div className={styles.retryKeys}>
          <kbd>ESC</kbd>
          <kbd>Space</kbd>
          <kbd>Enter</kbd>
        </div>
      </div>
    </section>
  )
}

export default Retry
