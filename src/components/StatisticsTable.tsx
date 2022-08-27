import React from 'react'

import styles from './StatisticsTable.module.scss'

export type StatisticsTableProps = {
  records?: StatisticsTableRecord[]
  columns?: StatisticsTableColumn[]
}

export type StatisticsTableRecord = {
  label: string
  failureCount: number
  spm: number
  wpm: number
  strokeCount: number
  wordCount: number
  duration: number
}

export type StatisticsTableColumn = {
  name: keyof StatisticsTableRecord
  label: string
  fractionDigits?: number
}

function StatisticsTable({
  records = [],
  columns = [],
}: StatisticsTableProps) {
  return (
    <table className={styles.root}>
      <thead>
        <tr className={styles.row}>
          <th className={styles.column}></th>
          {columns.map(({ name, label }, index) => (
            <th className={styles.column} key={`${name}${index}`}>{label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {records.map((record, trIndex) => (
          <tr key={trIndex} className={styles.row}>
            <th className={styles.column}>{record.label}</th>
            {columns.map(({ name, fractionDigits }, tdIndex) => {
              const value = record[name]
              if (
                typeof value === 'number' &&
                typeof fractionDigits === 'number'
              ) {
                return (
                  <td key={tdIndex} className={styles.column}>
                    {value < 0 || isNaN(value)
                      ? '-'
                      : value.toFixed(fractionDigits)}
                  </td>
                )
              }
              return <td key={tdIndex} className={styles.column}>value</td>
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default StatisticsTable
