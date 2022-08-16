import React from 'react'

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
    <table>
      <thead>
        <tr>
          <th></th>
          {columns.map(({ name, label }, index) => (
            <th key={`${name}${index}`}>{label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {records.map((record, trIndex) => (
          <tr key={trIndex}>
            <th>{record.label}</th>
            {columns.map(({ name, fractionDigits }, tdIndex) => {
              const value = record[name]
              if (
                typeof value === 'number' &&
                typeof fractionDigits === 'number'
              ) {
                return (
                  <td key={tdIndex}>
                    {value < 0 || isNaN(value)
                      ? '-'
                      : value.toFixed(fractionDigits)}
                  </td>
                )
              }
              return <td key={tdIndex}>value</td>
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default StatisticsTable
