function getPerMinuteByMilliseconds(count: number, duration: number): number {
  return (count / duration) * 60000
}

export default getPerMinuteByMilliseconds
