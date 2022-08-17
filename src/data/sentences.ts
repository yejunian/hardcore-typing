import sentences from './sentences.json'

export type SentenceData = SentenceEntry[]

export type SentenceEntry = {
  sentence: string
  reference: string
}

export const fallbackSentenceEntry = {
  sentence: '',
  reference: '',
}

export default sentences as SentenceData
