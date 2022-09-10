import { events } from '../constants/events'
import { worker } from './worker'

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

export const setNextKinematicTransform = (
  id: number,
  translation: { x: number, y: number, z: number },
  rotation: { w: number, x: number, y: number, z: number }
) => {
  worker.postMessage({
    event: events.SET_NEXT_KINEMATIC_TRANSFORM,
    id,
    rotation,
    translation,
  })
}

/**
 *
 * @param transforms
 */
export const setNextKinematicTransforms = (
  ids: Uint16Array,
  transforms: Float32Array
) => {
  worker.postMessage({
    event: events.SET_NEXT_KINEMATIC_TRANSFORMS,
    ids,
    transforms,
  }, [ids.buffer, transforms.buffer])
}

export const setTranslation = (
  id: number,
  translation: { x: number, y: number, z: number },
  resetAngvel: boolean,
  resetLinvel: boolean
) => {
  worker.postMessage({
    event: events.SET_TRANSLATION,
    id,
    resetAngvel,
    resetLinvel,
    translation,
  })
}

export const setTranslations = (
  ids: Uint16Array,
  translations: Float32Array,
  resetAngvel: boolean,
  resetLinvel: boolean
) => {
  worker.postMessage({
    event: events.SET_TRANSLATIONS,
    ids,
    resetAngvel,
    resetLinvel,
    translations,
  }, [ids.buffer, translations.buffer])
}

export const setTransforms = (ids: Uint16Array, transforms: Float32Array) => {
  worker.postMessage({
    event: events.SET_TRANSFORMS,
    ids,
    transforms,
  }, [ids.buffer, transforms.buffer])
}

export const setTransformsAndVelocities = (ids: Uint16Array, array: Float32Array) => {
  worker.postMessage({
    array,
    event: events.SET_TRANSFORMS_AND_VELOCITIES,
    ids,
  }, [array.buffer, ids.buffer])
}

export const setVelocities = (ids: Uint16Array, velocities: Float32Array) => {
  worker.postMessage({
    event: events.SET_VELOCITIES,
    ids,
    velocities,
  }, [ids.buffer, velocities.buffer])
}
