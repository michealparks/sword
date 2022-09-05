import { bodymap } from './bodies'
import { events } from '../constants/events'

export const getVelocities = (ids: Float32Array, pid: number) => {
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
    buffer: velocities.buffer,
    event: events.GET_VELOCITIES,
    pid,
  }, [velocities.buffer])
}
