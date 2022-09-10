import { createPromise, createPromiseId } from '.'
import { events } from '../constants/events'
import { worker } from './worker'

export const getVelocity = (id: number) => {
  const pid = createPromiseId()

  worker.postMessage({
    event: events.GET_VELOCITY,
    id,
    pid,
  })

  return createPromise<{ x: number, y: number, z: number }>(pid)
}

export const getVelocities = (ids: Uint16Array) => {
  const pid = createPromiseId()

  worker.postMessage({
    event: events.GET_VELOCITIES,
    ids,
    pid,
  }, [ids.buffer])

  return createPromise<Float32Array>(pid)
}
