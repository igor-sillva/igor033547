export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ')
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunkedArray = []
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size)
    chunkedArray.push(chunk)
  }
  return chunkedArray
}
