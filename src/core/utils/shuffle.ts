function shuffle<T>(src: T[]): T[] {
  const result = [...src]

  for (let i = 0; i < result.length - 1; i += 1) {
    const j = i + Math.floor((result.length - i) * Math.random())

    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }

  return result
}

export default shuffle
