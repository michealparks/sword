const promises = new Map<number, any>()

let currentPid = 0
let currentId = -1

export const createBodyId = () => {
  currentId += 1
  return currentId
}

export const createPromiseId = () => {
  currentPid += 1
  currentPid %= 5_000
  return currentPid
}

export const createPromise = <Type>(id: number): Promise<Type> => {
  return new Promise((resolve) => {
    promises.set(id, resolve)
  })
}

export const execPromise = (pid: number, data?: any) => {
  promises.get(pid)(data)
  promises.delete(pid)
}

/**
 * Gets the number of bodies in the physics world.
 *
 * @returns The number of bodies.
 */
export const count = () => {
  return currentId
}
