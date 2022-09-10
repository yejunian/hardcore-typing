import classNames from 'classnames'
import React from 'react'

import CommonProps from './CommonProps'
import styles from './StatisticsTable.module.scss'

export type StatisticsTableProps = CommonProps & {
  records?: StatisticsTableRecord[]
  columns?: StatisticsTableColumn[]
}

export type StatisticsTableRecordPatch = {
  failureCount: number
  strokeCount: number
  wordCount: number
  duration: number
}

export type StatisticsTableRecord = StatisticsTableRecordPatch & {
  label: string
  spm: number
  wpm: number
}

export type StatisticsTableColumn = {
  name: keyof StatisticsTableRecord
  label: string
  fractionDigits?: number
  factor?: number
}

function StatisticsTable({
  className,
  records = [],
  columns = [],
}: StatisticsTableProps) {
  return (
    <table className={classNames(className, styles.root)}>
      <thead>
        <tr className={styles.row}>
          <th className={styles.column}></th>
          {columns.map(({ name, label }, index) => (
            <th className={styles.column} key={`${name}${index}`}>
              {label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {records.map((record, trIndex) => (
          <tr key={trIndex} className={styles.row}>
            <th className={styles.column}>{record.label}</th>
            {columns.map(({ name, fractionDigits, factor }, tdIndex) => {
              const originalValue = record[name]
              let value
              if (typeof originalValue === 'number') {
                if (typeof fractionDigits === 'number') {
                  const factoredValue = originalValue * (factor ?? 1)
                  value = factoredValue < 0 || isNaN(factoredValue)
                    ? '-'
                    : factoredValue.toFixed(fractionDigits)
                } else {
                  value = originalValue * (factor ?? 1)
                }
              } else {
                value = originalValue
              }
              return (
                <td key={tdIndex} className={styles.column}>
                  {value}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default StatisticsTable
