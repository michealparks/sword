const promises = new Map<number, unknown>()

let currentPid = 0

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

export const execPromise = (pid: number, data?: unknown) => {
  const resolver = promises.get(pid) as (arg: unknown) => void
  resolver(data)
  promises.delete(pid)
}

/**
 * Gets the number of bodies in the physics world.
 *
 * @returns The number of bodies.
 */
export const count = () => {
  // @TODO currentId
  return 0
}
