import { events } from '../constants/events'
import { worker } from './worker'

export const applyImpulses = (impulses: Float32Array) => {
  worker.postMessage({
    buffer: impulses.buffer,
    event: events.APPLY_IMPULSES,
  }, [impulses.buffer])
}

export const applyLinearAndTorqueImpulses = (impulses: Float32Array) => {
  worker.postMessage({
    buffer: impulses.buffer,
    event: events.APPLY_LINEAR_AND_TORQUE_IMPULSES,
  }, [impulses.buffer])
}

export const applyTorqueImpulses = (impulses: Float32Array) => {
  worker.postMessage({
    buffer: impulses.buffer,
    event: events.APPLY_TORQUE_IMPULSES,
  }, [impulses.buffer])
}

