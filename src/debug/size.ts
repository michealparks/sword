export const roughSizeOfObject = (object: unknown) => {
  const objectList: unknown[] = []
  const stack: unknown[] = [object]
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

      for (const key in value) {
        if (Object.hasOwn(value, key)) {
          // @ts-expect-error We don't care lol
          stack.push(value[key])
        }
      }
    }
  }

  return bytes
}
