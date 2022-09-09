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

export const setNextKinematicTransforms = (transforms: Float32Array) => {
  for (let i = 0, l = transforms.length; i < l; i += 8) {
    const body = bodymap.get(transforms[i + 0])!

    body.setNextKinematicTranslation({
      x: transforms[i + 1],
      y: transforms[i + 2],
      z: transforms[i + 3],
    })

    body.setNextKinematicRotation({
      w: transforms[i + 7],
      x: transforms[i + 4],
      y: transforms[i + 5],
      z: transforms[i + 6],
    })
  }
}

export const setTransforms = (transforms: Float32Array) => {
  for (let i = 0, l = transforms.length; i < l; i += 8) {
    const body = bodymap.get(transforms[i + 0])!

    body.setTranslation({
      x: transforms[i + 1],
      y: transforms[i + 2],
      z: transforms[i + 3],
    }, false)

    body.setRotation({
      w: transforms[i + 7],
      x: transforms[i + 4],
      y: transforms[i + 5],
      z: transforms[i + 6],
    }, true)
  }
}

export const setVelocities = (velocities: Float32Array) => {
  for (let i = 0, l = velocities.length; i < l; i += 7) {
    const body = bodymap.get(velocities[i + 0])!

    body.setLinvel({
      x: velocities[i + 1],
      y: velocities[i + 2],
      z: velocities[i + 3],
    }, false)

    body.setAngvel({
      x: velocities[i + 4],
      y: velocities[i + 5],
      z: velocities[i + 6],
    }, true)
  }
}

export const setTransformsAndVelocities = (array: Float32Array) => {
  for (let i = 0, l = array.length; i < l; i += 14) {
    const body = bodymap.get(array[i + 0])!

    body.setTranslation({
      x: array[i + 1],
      y: array[i + 2],
      z: array[i + 3],
    }, false)

    body.setRotation({
      w: array[i + 7],
      x: array[i + 4],
      y: array[i + 5],
      z: array[i + 6],
    }, false)

    body.setLinvel({
      x: array[i + 8],
      y: array[i + 9],
      z: array[i + 10],
    }, false)

    body.setAngvel({
      x: array[i + 11],
      y: array[i + 12],
      z: array[i + 13],
    }, true)
  }
}

export const setTranslations = (
  translations: Float32Array,
  resetAngvel: boolean,
  resetLinvel: boolean
) => {
  for (let i = 0, l = translations.length; i < l; i += 4) {
    const body = bodymap.get(translations[i + 0])!

    body.setTranslation({
      x: translations[i + 1],
      y: translations[i + 2],
      z: translations[i + 3],
    }, true)

    if (resetAngvel) {
      resetAngularVelocity(body)
    }

    if (resetLinvel) {
      resetLinearVelocity(body)
    }
  }
}
