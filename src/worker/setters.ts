import { bodymap, collidermap } from './bodies'
import type RAPIER from '@dimforge/rapier3d-compat'

const resetAngularVelocity = (body: RAPIER.RigidBody) => {
  body.setAngvel({ x: 0, y: 0, z: 0 }, true)
}

const resetLinearVelocity = (body: RAPIER.RigidBody) => {
  body.setLinvel({ x: 0, y: 0, z: 0 }, true)
}

export const setActiveCollisionTypes = (id: number, types: number) => {
  collidermap.get(id)!.setActiveCollisionTypes(types)
}

export const setCollisionGroups = (id: number, group: number) => {
  collidermap.get(id)!.setCollisionGroups(group)
}

interface Data {
  id: number
  translation: RAPIER.Vector3
  rotation: RAPIER.Rotation
}

export const setNextKinematicTransform = (data: Data) => {
  const body = bodymap.get(data.id)!
  body.setNextKinematicTranslation(data.translation)
  body.setNextKinematicRotation(data.rotation)
}

export const setNextKinematicTransforms = (
  ids: Uint16Array,
  transforms: Float32Array
) => {
  for (let i = 0, j = 0, l = ids.length; i < l; i += 1, j += 7) {
    const body = bodymap.get(ids[i])!

    body.setNextKinematicTranslation({
      x: transforms[j + 0],
      y: transforms[j + 1],
      z: transforms[j + 2],
    })

    body.setNextKinematicRotation({
      w: transforms[j + 6],
      x: transforms[j + 3],
      y: transforms[j + 4],
      z: transforms[j + 5],
    })
  }
}

export const setTransforms = (ids: Uint16Array, transforms: Float32Array) => {
  for (let i = 0, j = 0, l = ids.length; i < l; i += 1, j += 7) {
    const body = bodymap.get(ids[i])!

    body.setTranslation({
      x: transforms[j + 0],
      y: transforms[j + 1],
      z: transforms[j + 2],
    }, false)

    body.setRotation({
      w: transforms[j + 6],
      x: transforms[j + 3],
      y: transforms[j + 4],
      z: transforms[j + 5],
    }, true)
  }
}

export const setVelocities = (ids: Uint16Array, velocities: Float32Array) => {
  for (let i = 0, j = 0, l = velocities.length; i < l; i += 1, j += 6) {
    const body = bodymap.get(ids[i])!

    body.setLinvel({
      x: velocities[j + 0],
      y: velocities[j + 1],
      z: velocities[j + 2],
    }, false)

    body.setAngvel({
      x: velocities[j + 3],
      y: velocities[j + 4],
      z: velocities[j + 5],
    }, true)
  }
}

export const setTransformAndVelocity = (
  id: number,
  translation: RAPIER.Vector,
  rotation: RAPIER.Rotation,
  linvel: RAPIER.Vector,
  angvel: RAPIER.Vector
) => {
  const body = bodymap.get(id)!
  body.setTranslation(translation, false)
  body.setRotation(rotation, false)
  body.setLinvel(linvel, false)
  body.setAngvel(angvel, true)
}

export const setTransformsAndVelocities = (ids: Uint16Array, array: Float32Array) => {
  for (let i = 0, j = 0, l = ids.length; i < l; i += 1, j += 13) {
    const body = bodymap.get(ids[i])!

    body.setTranslation({
      x: array[j + 0],
      y: array[j + 1],
      z: array[j + 2],
    }, false)

    body.setRotation({
      w: array[j + 6],
      x: array[j + 3],
      y: array[j + 4],
      z: array[j + 5],
    }, false)

    body.setLinvel({
      x: array[j + 7],
      y: array[j + 8],
      z: array[j + 9],
    }, false)

    body.setAngvel({
      x: array[j + 10],
      y: array[j + 11],
      z: array[j + 12],
    }, true)
  }
}

export const setTranslation = (
  id: number,
  translation: { x: number, y: number, z: number },
  resetAngvel: boolean,
  resetLinvel: boolean
) => {
  const body = bodymap.get(id)!
  body.setTranslation(translation, true)

  if (resetAngvel) {
    resetAngularVelocity(body)
  }

  if (resetLinvel) {
    resetLinearVelocity(body)
  }
}

export const setTranslations = (
  ids: Uint16Array,
  translations: Float32Array,
  resetAngvel: boolean,
  resetLinvel: boolean
) => {
  for (let i = 0, j = 0, l = ids.length; i < l; i += 1, j += 3) {
    const body = bodymap.get(ids[i])!

    body.setTranslation({
      x: translations[j + 0],
      y: translations[j + 1],
      z: translations[j + 2],
    }, true)

    if (resetAngvel) {
      resetAngularVelocity(body)
    }

    if (resetLinvel) {
      resetLinearVelocity(body)
    }
  }
}
