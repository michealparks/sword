import { events } from '../constants/events'
import { worker } from './worker'

export const disableBody = (id: number) => {
  worker.postMessage({
    event: events.DISABLE_BODY,
    id,
  })
}

export const setActiveCollisionTypes = (id: number, types: number) => {
  worker.postMessage({
    event: events.SET_ACTIVE_COLLISION_TYPES,
    id,
    types,
  })
}

export const setForces = (ids: Uint16Array, forces: Float32Array) => {
  worker.postMessage({
    event: events.SET_FORCES,
    forces,
    ids,
  }, [forces.buffer, ids.buffer])
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

export const setTransforms = (
  ids: Uint16Array,
  transforms: Float32Array,
  resetAngvel: boolean,
  resetLinvel: boolean
) => {
  worker.postMessage({
    event: events.SET_TRANSFORMS,
    ids,
    resetAngvel,
    resetLinvel,
    transforms,
  }, [ids.buffer, transforms.buffer])
}

export const setTransformAndVelocity = (
  id: number,
  translation: { x: number; y: number; z: number },
  rotation: { w: number; x: number; y: number; z: number },
  linvel: { x: number; y: number; z: number },
  angvel: { x: number; y: number; z: number }
) => {
  worker.postMessage({
    angvel,
    event: events.SET_TRANSFORM_AND_VELOCITY,
    id,
    linvel,
    rotation,
    translation,
  })
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

export const setVelocitiesAndRotations = (ids: Uint16Array, array: Float32Array) => {
  worker.postMessage({
    array,
    event: events.SET_VELOCITIES_AND_ROTATIONS,
    ids,
  }, [array.buffer, ids.buffer])
}
