export const roughSizeOfObject = (object) => {
  const objectList = []
  const stack = [object]
  let bytes = 0

  while (stack.length) {
    const value = stack.pop()

    if (typeof value === 'boolean') {
      bytes += 4
    } else if (typeof value === 'string') {
      bytes += value.length * 2
    } else if (typeof value === 'number') {
      bytes += 8
    } else if
    (
      typeof value === 'object' &&
        !objectList.includes(value)
    ) {
      objectList.push(value)

      for (const i in value) {
        stack.push(value[i])
      }
    }
  }

  return bytes
}
