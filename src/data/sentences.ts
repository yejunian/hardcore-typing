import sentences from './sentences.json'

export type SentenceData = SentenceEntry[]

export type SentenceEntry = {
  sentence: string
  reference: string
}

export default sentences as SentenceData
