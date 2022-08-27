import { bodymap } from './bodies'

export const applyImpulses = (impulses: Float32Array) => {
  for (let i = 0, l = impulses.length; i < l; i += 4) {
    bodymap.get(impulses[i])!.applyImpulse({
      x: impulses[i + 1],
      y: impulses[i + 2],
      z: impulses[i + 3],
    }, true)
  }
}

export const applyLinearAndTorqueImpulses = (impulses: Float32Array) => {
  for (let i = 0, l = impulses.length; i < l; i += 7) {
    const body = bodymap.get(impulses[i])!

    body.applyImpulse({
      x: impulses[i + 1],
      y: impulses[i + 2],
      z: impulses[i + 3],
    }, false)

    body.applyTorqueImpulse({
      x: impulses[i + 4],
      y: impulses[i + 5],
      z: impulses[i + 6],
    }, true)
  }
}

export const applyTorqueImpulses = (impulses: Float32Array) => {
  for (let i = 0, l = impulses.length; i < l; i += 4) {
    bodymap.get(impulses[i])!.applyTorqueImpulse({
      x: impulses[i + 1],
      y: impulses[i + 2],
      z: impulses[i + 3],
    }, true)
  }
}
