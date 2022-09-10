import { bodymap } from './bodies'
import { events } from '../constants/events'

export const getVelocity = (id: number, pid: number) => {
  const body = bodymap.get(id)!
  const linvel = body.linvel()
  const angvel = body.angvel()

  self.postMessage({
    angvel,
    event: events.GET_VELOCITY,
    linvel,
    pid,
  })
}

export const getVelocities = (ids: Uint16Array, pid: number) => {
  const velocities = new Float32Array(ids.length * 6)

  for (let i = 0, j = 0, l = ids.length; i < l; i += 1, j += 6) {
    const body = bodymap.get(ids[i])!
    const linvel = body.linvel()
    const angvel = body.angvel()

    velocities[j + 0] = linvel.x
    velocities[j + 1] = linvel.y
    velocities[j + 2] = linvel.z
    velocities[j + 3] = angvel.x
    velocities[j + 4] = angvel.y
    velocities[j + 5] = angvel.z
  }

  self.postMessage({
    event: events.GET_VELOCITIES,
    pid,
    velocities,
  }, [velocities.buffer])
}
