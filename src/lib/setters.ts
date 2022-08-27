import { events } from '../constants/events'
import { worker } from './worker'

/**
 * Sets the gravity of the physics world.
 *
 * @param x The gravity x component.
 * @param y The gravity y component.
 * @param z The gravity z component.
 */
export const setGravity = (x: number, y: number, z: number) => {
  worker.postMessage({
    event: events.SET_GRAVITY,
    x,
    y,
    z,
  })
}

export const setTranslation = (id: number, x: number, y: number, z: number) => {
  worker.postMessage({
    event: events.SET_TRANSLATION,
    id,
    x,
    y,
    z,
  })
}

export const setTransforms = (transforms: Float32Array) => {
  worker.postMessage({
    buffer: transforms.buffer,
    event: events.SET_TRANSFORMS,
  }, [transforms.buffer])
}

export const setNextKinematicTransforms = (transforms: Float32Array) => {
  worker.postMessage({
    buffer: transforms.buffer,
    event: events.SET_NEXT_KINEMATIC_TRANSFORMS,
  }, [transforms.buffer])
}
