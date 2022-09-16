import { separator } from '../constants'

export type SentenceToken = {
  type: 'word' | 'separator'
  content: string
}

function tokenizeString(content: string): SentenceToken[] {
  const tokens: SentenceToken[] = []

  let rest = content

  while (rest.length > 0) {
    const index = rest.search(separator)

    if (index < 0) {
      tokens.push({
        type: 'word',
        content: rest,
      })

      rest = ''
    } else {
      tokens.push(
        {
          type: 'word',
          content: rest.slice(0, index),
        },
        {
          type: 'separator',
          content: rest.slice(index, index + 1), // NOTE (1)
        }
      )

      rest = rest.slice(index + 1) // NOTE (1)
    }
  }

  return tokens
}

export default tokenizeString

/* NOTE
 * (1) If `separator` has multi-length separators, `index + 1` must be modified.
 */
