import { events } from '../constants/events'
import { update } from 'three-kit'
import { worker } from './worker'

export const pendingImpulses: number[] = []

/**
 * @param impulses an array of impulses
 */
export const applyImpulses = (impulses: Float32Array) => {
  worker.postMessage({
    buffer: impulses.buffer,
    event: events.APPLY_IMPULSES,
  }, [impulses.buffer])
}

export const applyImpulse = (id: number, x: number, y: number, z: number) => {
  pendingImpulses.push(id, x, y, z)
}

/**
 *
 * @param impulses an array of impulses
 */
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

update(() => {
  if (pendingImpulses.length > 0) {
    applyImpulses(new Float32Array(pendingImpulses))
    pendingImpulses.splice(0, pendingImpulses.length)
  }
})
