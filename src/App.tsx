import React, { useEffect, useState } from 'react'

import TypeBoard, { TypingResult } from './components/TypeBoard'
import sentences, {
  fallbackSentenceEntry,
  SentenceData,
} from './data/sentences'
import shuffle from './core/utils/shuffle'
import StatisticsTable, {
  StatisticsTableColumn,
  StatisticsTableRecord,
} from './components/StatisticsTable'
import getPerMinuteByMilliseconds from './utils/getPerMinuteByMilliseconds'

const statisticsTableColumn: StatisticsTableColumn[] = [
  { name: 'failureCount', label: '실패 횟수', fractionDigits: 0 },
  { name: 'spm', label: '분당 타수', fractionDigits: 1 },
  { name: 'wpm', label: '분당 어절수', fractionDigits: 1 },
  { name: 'strokeCount', label: '입력 타수', fractionDigits: 0 },
  { name: 'wordCount', label: '입력 어절수', fractionDigits: 0 },
  { name: 'duration', label: '입력 시간', fractionDigits: 3 },
]

const fallbackRecord: StatisticsTableRecord = {
  label: '이전 문장',
  failureCount: NaN,
  spm: NaN,
  wpm: NaN,
  strokeCount: NaN,
  wordCount: NaN,
  duration: NaN,
}

function App() {
  const [shuffledSentences, setShuffledSentences] = useState<SentenceData>([])
  const [sentenceIndex, setSentenceIndex] = useState(0)

  const [prevRecord, setPrevRecord] =
    useState<StatisticsTableRecord>(fallbackRecord)

  const [currentFailureCount, setCurrentFailureCount] = useState(0)
  const [currentStrokeCount, setCurrentStrokeCount] = useState(0)
  const [currentWordCount, setCurrentWordCount] = useState(0)
  const [currentDuration, setCurrentDuration] = useState(0)

  const [overallFailureCount, setOverallFailureCount] = useState(0)
  const [overallStrokesPerMinute, setOverallStrokesPerMinute] = useState(NaN)
  const [overallWordsPerMinute, setOverallWordsPerMinute] = useState(NaN)
  const [overallStrokeCount, setOverallStrokeCount] = useState(0)
  const [overallWordCount, setOverallWordCount] = useState(0)
  const [overallDuration, setOverallDuration] = useState(0)

  const statisticsTableRecord: StatisticsTableRecord[] = [
    sentenceIndex === 0 ? fallbackRecord : prevRecord,
    {
      label: '현재 문장',
      failureCount: currentFailureCount,
      spm: getPerMinuteByMilliseconds(
        currentStrokeCount,
        currentDuration
      ),
      wpm: getPerMinuteByMilliseconds(currentWordCount, currentDuration),
      strokeCount: currentStrokeCount,
      wordCount: currentWordCount,
      duration: currentDuration / 1000,
    },
    {
      label: '누적',
      failureCount: overallFailureCount,
      spm: overallStrokesPerMinute,
      wpm: overallWordsPerMinute,
      strokeCount: overallStrokeCount,
      wordCount: overallWordCount,
      duration: overallDuration / 1000,
    },
  ]

  const shuffleSentences = () => {
    setShuffledSentences(shuffle(sentences))
  }

  useEffect(() => {
    if (shuffledSentences.length === 0 && sentences.length !== 0) {
      shuffleSentences()
    }
  }, [shuffledSentences])

  useEffect(() => {
    const spm = getPerMinuteByMilliseconds(overallStrokeCount, overallDuration)
    const wpm = getPerMinuteByMilliseconds(overallWordCount, overallDuration)

    setOverallStrokesPerMinute(spm)
    setOverallWordsPerMinute(wpm)
  }, [overallStrokeCount, overallWordCount, overallDuration])

  const handleTypeBoardSucceed = ({
    userText,
    strokeCount,
    duration,
  }: TypingResult) => {
    const wordCount = userText.trim().split(' ').length

    setPrevRecord({
      duration: duration / 1000,
      failureCount: currentFailureCount,
      strokeCount,
      wordCount,
      label: '이전 문장',
      spm: getPerMinuteByMilliseconds(strokeCount, duration),
      wpm: getPerMinuteByMilliseconds(wordCount, duration),
    })

    setOverallStrokeCount((v) => v + strokeCount)
    setOverallWordCount((v) => v + wordCount)
    setOverallDuration((v) => v + duration)

    setCurrentFailureCount(0)
    setCurrentStrokeCount(0)
    setCurrentWordCount(0)
    setCurrentDuration(0)

    setSentenceIndex((v) => (v >= shuffledSentences.length - 1 ? 0 : v + 1))
  }

  const handleTypeBoardFail = () => {
    setCurrentFailureCount((v) => v + 1)
    setOverallFailureCount((v) => v + 1)
  }

  const handleTypeBoardReset = ({ userText }: TypingResult) => {
    if (userText) {
      setCurrentFailureCount((v) => v + 1)
      setOverallFailureCount((v) => v + 1)
    }
  }

  const handleTypeBoardUpdate = ({
    userText,
    strokeCount,
    duration,
  }: TypingResult) => {
    setCurrentStrokeCount(strokeCount)
    setCurrentWordCount(userText.trim().split(' ').length)
    setCurrentDuration(duration)
  }

  return (
    <div>
      <h1>하드코어 타이핑</h1>

      <TypeBoard
        sentence={shuffledSentences[sentenceIndex] ?? fallbackSentenceEntry}
        onSucceed={handleTypeBoardSucceed}
        onFail={handleTypeBoardFail}
        onReset={handleTypeBoardReset}
        onUpdate={handleTypeBoardUpdate}
      />

      <StatisticsTable
        records={statisticsTableRecord}
        columns={statisticsTableColumn}
      />
    </div>
  )
}

export default App
