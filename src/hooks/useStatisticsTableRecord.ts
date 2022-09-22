import { useMemo, useState } from 'react'

import {
  StatisticsTableRecord,
  StatisticsTableRecordPatch,
} from '../components/StatisticsTable'
import getPerMinuteByMilliseconds from '../utils/getPerMinuteByMilliseconds'

const patchableKeys: (keyof StatisticsTableRecordPatch)[] = [
  'failureCount',
  'strokeCount',
  'wordCount',
  'duration',
]

const fallbackRecord: StatisticsTableRecord = {
  label: '',
  spm: NaN,
  wpm: NaN,
  failureCount: 0,
  strokeCount: 0,
  wordCount: 0,
  duration: 0,
}

function useStatisticsTableRecord(
  label: string
): [
  StatisticsTableRecord,
  (data: Partial<StatisticsTableRecordPatch>) => void
] {
  const defaultRecord = useMemo(
    () => ({
      ...fallbackRecord,
      label,
    }),
    [label]
  )
  const [record, setRecord] = useState<StatisticsTableRecord>(defaultRecord)

  const patch = (data: Partial<StatisticsTableRecordPatch>) => {
    let newRecord = record

    for (const key of patchableKeys) {
      const newValue = data[key]

      if (typeof newValue === 'number' && record[key] !== newValue) {
        if (newRecord === record) {
          newRecord = { ...record }
        }

        newRecord[key] = newValue
      }
    }

    if (newRecord !== record) {
      if (
        newRecord.duration !== record.duration ||
        newRecord.strokeCount !== record.strokeCount
      ) {
        newRecord.spm = getPerMinuteByMilliseconds(
          newRecord.strokeCount,
          newRecord.duration
        )
      }
      if (
        newRecord.duration !== record.duration ||
        newRecord.wordCount !== record.wordCount
      ) {
        newRecord.wpm = getPerMinuteByMilliseconds(
          newRecord.wordCount,
          newRecord.duration
        )
      }

      setRecord(newRecord)
    }
  }

  return [record, patch]
}

export default useStatisticsTableRecord
