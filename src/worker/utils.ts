let currentId = -1

export const createBodyId = () => {
  currentId += 1
  return currentId
}

export const resetIds = () => {
  currentId = -1
}
