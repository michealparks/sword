import { bodymap } from './bodies'

export const applyImpulses = (ids: Uint16Array, impulses: Float32Array) => {
  for (let i = 0, j = 0, l = ids.length; i < l; i += 1, j += 3) {
    bodymap.get(ids[i])!.applyImpulse({
      x: impulses[j + 0],
      y: impulses[j + 1],
      z: impulses[j + 2],
    }, true)
  }
}

export const applyLinearAndTorqueImpulses = (
  ids: Uint16Array,
  impulses: Float32Array
) => {
  for (let i = 0, j = 0, l = ids.length; i < l; i += 1, j += 6) {
    const body = bodymap.get(ids[i])!

    body.applyImpulse({
      x: impulses[j + 0],
      y: impulses[j + 1],
      z: impulses[j + 2],
    }, false)

    body.applyTorqueImpulse({
      x: impulses[j + 3],
      y: impulses[j + 4],
      z: impulses[j + 5],
    }, true)
  }
}

export const applyTorqueImpulses = (ids: Uint16Array, impulses: Float32Array) => {
  for (let i = 0, j = 0, l = ids.length; i < l; i += 1, j += 3) {
    bodymap.get(ids[i])!.applyTorqueImpulse({
      x: impulses[j + 0],
      y: impulses[j + 1],
      z: impulses[j + 2],
    }, true)
  }
}
