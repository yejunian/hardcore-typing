import { separator } from '../constants'

function countWords(sentence: string): number {
  return sentence.trim().split(separator).length
}

export default countWords
