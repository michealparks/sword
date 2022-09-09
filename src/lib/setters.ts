import { events } from '../constants/events'
import { worker } from './worker'

const pendingKinematicTransform: number[] = []

export const setActiveCollisionTypes = (id: number, types: number) => {
  worker.postMessage({
    event: events.SET_ACTIVE_COLLISION_TYPES,
    id,
    types,
  })
}

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

/**
 *
 * @param transforms
 */
export const setNextKinematicTransforms = (transforms: Float32Array) => {
  worker.postMessage({
    buffer: transforms.buffer,
    event: events.SET_NEXT_KINEMATIC_TRANSFORMS,
  }, [transforms.buffer])
}

export const setNextKinematicTransform = (
  id: number,
  x: number, y: number, z: number,
  qx: number, qy: number, qz: number, qw: number
) => {
  pendingKinematicTransform.push(id, x, y, z, qx, qy, qz, qw)
}

export const setTranslations = (
  translations: Float32Array,
  resetAngvel: boolean,
  resetLinvel: boolean
) => {
  worker.postMessage({
    event: events.SET_TRANSLATIONS,
    resetAngvel,
    resetLinvel,
    translations,
  }, [translations.buffer])
}

export const setTransforms = (transforms: Float32Array) => {
  worker.postMessage({
    event: events.SET_TRANSFORMS,
    transforms,
  }, [transforms.buffer])
}

export const setTransformsAndVelocities = (array: Float32Array) => {
  worker.postMessage({
    array,
    event: events.SET_TRANSFORMS_AND_VELOCITIES,
  }, [array.buffer])
}

export const setVelocities = (velocities: Float32Array) => {
  worker.postMessage({
    event: events.SET_VELOCITIES,
    velocities,
  }, [velocities.buffer])
}
