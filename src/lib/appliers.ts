import { events } from '../constants/events'
import { worker } from './worker'

/**
 * @param impulses an array of impulses
 */
export const applyImpulses = (ids: Uint16Array, impulses: Float32Array) => {
  worker.postMessage({
    event: events.APPLY_IMPULSES,
    ids,
    impulses,
  }, [ids.buffer, impulses.buffer])
}

/**
 *
 * @param impulses an array of impulses
 */
export const applyLinearAndTorqueImpulses = (
  ids: Uint16Array,
  impulses: Float32Array
) => {
  worker.postMessage({
    event: events.APPLY_LINEAR_AND_TORQUE_IMPULSES,
    ids,
    impulses,
  }, [ids.buffer, impulses.buffer])
}

export const applyTorqueImpulses = (ids: Uint16Array, impulses: Float32Array) => {
  worker.postMessage({
    event: events.APPLY_TORQUE_IMPULSES,
    ids,
    impulses,
  }, [ids.buffer, impulses.buffer])
}
