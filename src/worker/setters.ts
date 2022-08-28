import { bodymap, collidermap } from './bodies'
import type RAPIER from '@dimforge/rapier3d-compat'

const resetAngularVelocity = (body: RAPIER.RigidBody) => {
  body.setAngvel({
    x: 0,
    y: 0,
    z: 0,
  }, true)
}

const resetLinearVelocity = (body: RAPIER.RigidBody) => {
  body.setLinvel({
    x: 0,
    y: 0,
    z: 0,
  }, true)
}

export const setActiveCollisionTypes = (id: number, types: number) => {
  collidermap.get(id)!.setActiveCollisionTypes(types)
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

export const setTransforms = (
  transforms: Float32Array,
  resetAngvel: boolean,
  resetLinvel: boolean
) => {
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

    if (resetAngvel) {
      resetAngularVelocity(body)
    }

    if (resetLinvel) {
      resetLinearVelocity(body)
    }
  }
}

export const setTranslation = (
  id: number,
  data: RAPIER.Vector,
  resetAngvel: boolean,
  resetLinvel: boolean
) => {
  const body = bodymap.get(id)!

  body.setTranslation(data, true)

  if (resetAngvel) {
    resetAngularVelocity(body)
  }

  if (resetLinvel) {
    resetLinearVelocity(body)
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
