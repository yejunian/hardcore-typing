import sentences from './sentences.json'

export type SentenceData = SentenceEntry[]

export type SentenceEntry = {
  sentence: string
  ref: string
}

export default sentences as SentenceData
