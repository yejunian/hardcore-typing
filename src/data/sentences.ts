import sentences from './sentences.json'

type SentenceData = SentenceEntry[]

type SentenceEntry = {
  sentence: string
  ref: string
}

export default sentences as SentenceData
