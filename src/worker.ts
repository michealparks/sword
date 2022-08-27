import RAPIER from '@dimforge/rapier3d-compat'
import type { RigidBodyOptions } from './types/internal'
import { createCollider } from './lib/colliders'
import { events } from './constants/events'
import { messages } from './constants/messages'

let world: RAPIER.World
let now = 0
let then = 0
let dt = 0
let fps = 0
let tickId = -1
let debugTickId = -1

const timestep = 1000 / 90
const bodies = new Set<RAPIER.RigidBody>()
const bodymap = new Map<number, RAPIER.RigidBody>()

const init = async (pid: number, x?: number, y?: number, z?: number) => {
  await RAPIER.init()

  world = new RAPIER.World({
    x: x ?? 0,
    y: y ?? -9.8,
    z: z ?? 0,
  })
  world.timestep = timestep / 1000

  self.postMessage({
    event: events.INIT,
    pid,
  })
}

const tick = () => {
  world.step()

  now = performance.now()
  dt = (now - then) / 1000
  fps = 1000 / (now - then)
  then = now

  const transforms = new Float32Array((bodies.size * 7) + 1)

  transforms[0] = messages.TRANSFORMS

  let cursor = 1

  for (const body of bodies) {
    const translation = body.translation()
    const rotation = body.rotation()

    transforms[cursor + 0] = translation.x
    transforms[cursor + 1] = translation.y
    transforms[cursor + 2] = translation.z
    transforms[cursor + 3] = rotation.x
    transforms[cursor + 4] = rotation.y
    transforms[cursor + 5] = rotation.z
    transforms[cursor + 6] = rotation.w
    cursor += 7
  }

  self.postMessage({
    buffer: transforms.buffer,
    event: events.TRANSFORMS,
  }, [transforms.buffer])
}

const debugTick = () => {
  const buffers = world.debugRender()

  self.postMessage({
    colors: buffers.colors.buffer,
    event: events.DEBUG_DRAW,
    vertices: buffers.vertices.buffer,
  }, [buffers.vertices.buffer, buffers.colors.buffer])
}

const run = (pid: number) => {
  now = performance.now()
  then = now
  tickId = self.setInterval(tick, timestep)
  debugTickId = self.setInterval(debugTick, timestep * 3)
  postMessage({
    event: events.RUN,
    pid,
  })
}

const pause = (pid: number) => {
  clearInterval(tickId)
  clearInterval(debugTickId)
  postMessage({
    event: events.PAUSE,
    pid,
  })
}

const createRigidBody = (body: RigidBodyOptions) => {
  const bodyDescription = new RAPIER.RigidBodyDesc(body.type)
    .setTranslation(body.x, body.y, body.z)
    .setRotation({
      w: body.qw,
      x: body.qx,
      y: body.qy,
      z: body.qz,
    })
    .setCanSleep(body.canSleep)
    .setCcdEnabled(body.ccd)

  const colliderDescription = createCollider(body)
    .setDensity(1.3)
    .setFriction(0.1)
    .setFrictionCombineRule(RAPIER.CoefficientCombineRule.Max)
    .setRestitution(0.5)
    .setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Max)
    .setMass(1)
    .setSensor(body.sensor)

  const rigidBody = world.createRigidBody(bodyDescription)
  const collider = world.createCollider(colliderDescription, rigidBody)

  if (body.type === RAPIER.RigidBodyType.Dynamic) {
    bodies.add(rigidBody)
  }

  bodymap.set(body.id, rigidBody)
}

const createRigidBodies = (bodies) => {
  for (let i = 0, l = bodies.length; i < l; i += 1) {
    createRigidBody(bodies[i])
  }
}

const applyImpulses = (impulses: Float32Array) => {
  for (let i = 0, l = impulses.length; i < l; i += 4) {
    // @ts-expect-error Body should exist
    bodymap.get(impulses[i]).applyImpulse({
      x: impulses[i + 1],
      y: impulses[i + 2],
      z: impulses[i + 3],
    }, true)
  }
}

const applyTorqueImpulses = (impulses: Float32Array) => {
  for (let i = 0, l = impulses.length; i < l; i += 4) {
    // @ts-expect-error Body should exist
    bodymap.get(impulses[i]).applyTorqueImpulse({
      x: impulses[i + 1],
      y: impulses[i + 2],
      z: impulses[i + 3],
    }, true)
  }
}

const applyLinearAndTorqueImpulses = (impulses: Float32Array) => {
  for (let i = 0, l = impulses.length; i < l; i += 7) {
    const body = bodymap.get(impulses[i])

    // @ts-expect-error Body should exist
    body.applyImpulse({
      x: impulses[i + 1],
      y: impulses[i + 2],
      z: impulses[i + 3],
    }, false)

    // @ts-expect-error Body should exist
    body.applyTorqueImpulse({
      x: impulses[i + 4],
      y: impulses[i + 5],
      z: impulses[i + 6],
    }, true)
  }
}

const setGravity = (x: number, y: number, z: number) => {
  world.gravity.x = x
  world.gravity.y = y
  world.gravity.z = z
}

self.addEventListener('message', (message) => {
  const { data } = message

  switch (data.event) {
  case events.INIT:
    return init(data.pid, data.x, data.y, data.z)
  case events.RUN:
    return run(data.pid)
  case events.PAUSE:
    return pause(data.pid)
  case events.CREATE_RIGIDBODIES:
    return createRigidBodies(data.bodies)
  case events.APPLY_IMPULSES:
    return applyImpulses(new Float32Array(data.buffer))
  case events.APPLY_TORQUE_IMPULSES:
    return applyTorqueImpulses(new Float32Array(data.buffer))
  case events.APPLY_LINEAR_AND_TORQUE_IMPULSES:
    return applyLinearAndTorqueImpulses(new Float32Array(data.buffer))
  case events.SET_GRAVITY:
    return setGravity(data.x, data.y, data.z)
  default:
    throw new Error(`Unexpected event ${data.event}!`)
  }
})

if (import.meta.env.SWORD_DEBUG === 'true') {
  setInterval(() => {
    postMessage({
      event: events.FPS,
      fps,
    })
  }, 1000)
}
