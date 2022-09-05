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

export const setMasses = (masses: Float32Array) => {
  worker.postMessage({
    buffer: masses.buffer,
    event: events.SET_MASSES,
  }, [masses.buffer])
}

export const setNextKinematicTransforms = (transforms: Float32Array) => {
  worker.postMessage({
    buffer: transforms.buffer,
    event: events.SET_NEXT_KINEMATIC_TRANSFORMS,
  }, [transforms.buffer])
}

export const setTranslations = (
  translations: Float32Array,
  resetAngvel: boolean,
  resetLinvel: boolean
) => {
  worker.postMessage({
    buffer: translations.buffer,
    event: events.SET_TRANSLATIONS,
    resetAngvel,
    resetLinvel,
  }, [translations.buffer])
}

export const setTransforms = (transforms: Float32Array) => {
  worker.postMessage({
    buffer: transforms.buffer,
    event: events.SET_TRANSFORMS,
  }, [transforms.buffer])
}

export const setTransformsAndVelocities = (array: Float32Array) => {
  worker.postMessage({
    buffer: array.buffer,
    event: events.SET_TRANSFORMS_AND_VELOCITIES,
  })
}

export const setVelocities = (velocities: Float32Array) => {
  worker.postMessage({
    buffer: velocities.buffer,
    event: events.SET_VELOCITIES,
  }, [velocities.buffer])
}
