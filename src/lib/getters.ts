import { createPromise, createPromiseId } from '.'
import { events } from '../constants/events'
import { worker } from './worker'

export const getVelocities = (ids: Float32Array) => {
  const pid = createPromiseId()

  worker.postMessage({
    buffer: ids.buffer,
    event: events.GET_VELOCITIES,
    pid,
  }, [ids.buffer])

  return createPromise<Float32Array>(pid)
}
