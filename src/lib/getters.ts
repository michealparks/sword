import { createPromise, createPromiseId } from '.'
import type RAPIER from '@dimforge/rapier3d-compat'
import { events } from '../constants/events'
import { worker } from './worker'

export const getVelocity = (id: number) => {
  const pid = createPromiseId()

  worker.postMessage({
    event: events.GET_VELOCITY,
    id,
    pid,
  })

  return createPromise<{ angvel: RAPIER.Vector3, linvel: RAPIER.Vector3 }>(pid)
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
