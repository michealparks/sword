import type RAPIER from '@dimforge/rapier3d-compat'
import { bodymap } from './bodies'

export const setNextKinematicTransforms = (transforms: Float32Array) => {
  for (let i = 0, l = transforms.length; i < l; i += 8) {
    const body = bodymap.get(transforms[0])!

    body.setNextKinematicTranslation({
      x: transforms[1],
      y: transforms[2],
      z: transforms[3],
    })

    body.setNextKinematicRotation({
      w: transforms[7],
      x: transforms[4],
      y: transforms[5],
      z: transforms[6],
    })
  }
}

export const setTransforms = (transforms: Float32Array) => {
  for (let i = 0, l = transforms.length; i < l; i += 8) {
    const body = bodymap.get(transforms[0])!

    body.setTranslation({
      x: transforms[1],
      y: transforms[2],
      z: transforms[3],
    }, false)

    body.setRotation({
      w: transforms[7],
      x: transforms[4],
      y: transforms[5],
      z: transforms[6],
    }, true)
  }
}

export const setTranslation = (data: RAPIER.Vector & { id: number }) => {
  bodymap.get(data.id)!.setTranslation(data, true)
}
