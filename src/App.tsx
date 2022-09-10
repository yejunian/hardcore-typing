import React, { useEffect, useMemo, useState } from 'react'

import TypeBoard, { TypingResult } from './components/TypeBoard'
import StatisticsTable, {
  StatisticsTableColumn,
  StatisticsTableRecord,
} from './components/StatisticsTable'
import shuffle from './core/utils/shuffle'
import sentences, {
  fallbackSentenceEntry,
  SentenceData,
  SentenceEntry,
} from './data/sentences'
import useStatisticsTableRecord from './hooks/useStatisticsTableRecord'

import styles from './App.module.scss'

const statisticsTableColumn: StatisticsTableColumn[] = [
  { name: 'failureCount', label: '실패 횟수', fractionDigits: 0 },
  { name: 'spm', label: '분당 타수', fractionDigits: 1 },
  { name: 'wpm', label: '분당 어절수', fractionDigits: 1 },
  { name: 'strokeCount', label: '입력 타수', fractionDigits: 0 },
  { name: 'wordCount', label: '입력 어절수', fractionDigits: 0 },
  { name: 'duration', label: '입력 시간', fractionDigits: 3, factor: 0.001 },
]

function App() {
  const [shuffledSentences, setShuffledSentences] = useState<SentenceData>([])
  const [sentenceIndex, setSentenceIndex] = useState(0)

  const [prevRecord, patchPrevRecord] = useStatisticsTableRecord('이전 문장')
  const [currentRecord, patchCurrentRecord] = useStatisticsTableRecord('현재 문장')
  const [overallRecord, patchOverallRecord] = useStatisticsTableRecord('누적')

  const currentSentenceEntry: SentenceEntry = useMemo(
    () =>
      shuffledSentences.length === 0
        ? fallbackSentenceEntry
        : {
            ...shuffledSentences[sentenceIndex],
            sentence: shuffledSentences[sentenceIndex].sentence.replaceAll(
              /\u00b7/g,
              ', '
            ),
          },
    [sentenceIndex, shuffledSentences]
  )

  const statisticsTableRecord: StatisticsTableRecord[] = [
    prevRecord,
    currentRecord,
    overallRecord,
  ]

  const shuffleSentences = () => {
    setShuffledSentences(shuffle(sentences))
  }

  useEffect(() => {
    if (shuffledSentences.length === 0 && sentences.length !== 0) {
      shuffleSentences()
    }
  }, [shuffledSentences])

  const handleTypeBoardSucceed = ({
    userText,
    strokeCount,
    duration,
  }: TypingResult) => {
    const wordCount = userText.trim().split(/ |\u00b7/).length

    patchPrevRecord({
      strokeCount,
      wordCount,
      duration: duration,
      failureCount: currentRecord.failureCount,
    })

    patchOverallRecord({
      strokeCount: overallRecord.strokeCount + strokeCount,
      wordCount: overallRecord.wordCount + wordCount,
      duration: overallRecord.duration + duration,
    })

    patchCurrentRecord({
      failureCount: 0,
      strokeCount: 0,
      wordCount: 0,
      duration: 0,
    })

    setSentenceIndex((v) => (v >= shuffledSentences.length - 1 ? 0 : v + 1))
  }

  const handleTypeBoardFail = () => {
    patchCurrentRecord({ failureCount: currentRecord.failureCount + 1 })
    patchOverallRecord({ failureCount: overallRecord.failureCount + 1 })
  }

  const handleTypeBoardReset = ({ userText }: TypingResult) => {
    if (userText) {
      handleTypeBoardFail()
    }
  }

  const handleTypeBoardUpdate = ({
    userText,
    strokeCount,
    duration,
  }: TypingResult) => {
    patchCurrentRecord({
      strokeCount,
      duration: duration,
      wordCount: userText.trim().split(/ |\u00b7/).length,
    })
  }

  return (
    <section className={styles.root}>
      <main className={styles.main}>
        <h1 className={styles.title}>&#x2328;&#xfe0f; 하드코어 타이핑</h1>

        <TypeBoard
          className={styles.board}
          sentence={currentSentenceEntry}
          index={sentenceIndex}
          onSucceed={handleTypeBoardSucceed}
          onFail={handleTypeBoardFail}
          onReset={handleTypeBoardReset}
          onUpdate={handleTypeBoardUpdate}
        />

        <StatisticsTable
          className={styles.statistics}
          records={statisticsTableRecord}
          columns={statisticsTableColumn}
        />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/yejunian/hardcore-typing/blob/main/LICENSE"
          target="_blank"
          rel="noreferrer noopener"
        >
          Copyright &copy; 2022 yejunian
        </a>
        {' | '}
        <a
          href="https://github.com/yejunian"
          target="_blank"
          rel="noreferrer noopener"
        >
          GitHub Profile
        </a>
        {' | '}
        <a
          href="https://github.com/yejunian/hardcore-typing"
          target="_blank"
          rel="noreferrer noopener"
        >
          Repository
        </a>
      </footer>
    </section>
  )
}

export default App
