import type { RigidBodyWorkerOptions, Transform } from '../types/internal'
import {
  applyImpulses, applyLinearAndTorqueImpulses, applyTorqueImpulses
} from './appliers'
import { bodies, bodymap } from './bodies'
import { setNextKinematicTransforms, setTransforms, setTranslation } from './setters'
import RAPIER from '@dimforge/rapier3d-compat'
import { createCollider } from './colliders'
import { events } from '../constants/events'

let world: RAPIER.World
let now = 0
let then = 0
let dt = 0
let fps = 0
let tickId = -1
let debugTickId = -1

const timestep = 1000 / 90

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

  const transforms = new Float32Array(bodies.size * 8)

  let cursor = 0

  for (const body of bodies) {
    if (body.isSleeping()) {
      continue
    }

    const translation = body.translation()
    const rotation = body.rotation()
    transforms[cursor + 0] = body.userData as number
    transforms[cursor + 1] = translation.x
    transforms[cursor + 2] = translation.y
    transforms[cursor + 3] = translation.z
    transforms[cursor + 4] = rotation.x
    transforms[cursor + 5] = rotation.y
    transforms[cursor + 6] = rotation.z
    transforms[cursor + 7] = rotation.w
    cursor += 8
  }

  transforms[cursor] = -1

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

const run = (pid: number, debug = true) => {
  now = performance.now()
  then = now
  tickId = self.setInterval(tick, timestep)

  if (debug) {
    debugTickId = self.setInterval(debugTick, timestep * 3)
  }

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

const createRigidBody = (
  transform: Transform,
  options: RigidBodyWorkerOptions
) => {
  const bodyDescription = new RAPIER.RigidBodyDesc(options.type)
    .setTranslation(transform.x, transform.y, transform.z)
    .setRotation({
      w: transform.qw,
      x: transform.qx,
      y: transform.qy,
      z: transform.qz,
    })
    .setCanSleep(options.canSleep)
    .setCcdEnabled(options.ccd)

  const colliderDescription = createCollider(options)
    .setDensity(1.3)
    .setFriction(0.2)
    .setFrictionCombineRule(RAPIER.CoefficientCombineRule.Max)
    .setRestitution(0.5)
    .setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Max)
    .setMass(1)
    .setSensor(options.sensor)

  const rigidBody = world.createRigidBody(bodyDescription)
  const collider = world.createCollider(colliderDescription, rigidBody)

  if (options.type === RAPIER.RigidBodyType.Dynamic) {
    bodies.add(rigidBody)
  }

  rigidBody.userData = transform.id
  bodymap.set(transform.id, rigidBody)
}

const createRigidBodies = (bodyOptions: RigidBodyWorkerOptions[]) => {
  for (let i = 0, l = bodyOptions.length; i < l; i += 1) {
    const options = bodyOptions[i]
    for (let j = 0, jl = options.instances.length; j < jl; j += 1) {
      createRigidBody(options.instances[j], options)
    }
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
  case events.SET_NEXT_KINEMATIC_TRANSFORMS:
    return setNextKinematicTransforms(new Float32Array(data.buffer))
  case events.SET_TRANSLATION:
    return setTranslation(data)
  case events.SET_TRANSFORMS:
    return setTransforms(new Float32Array(data.buffer))
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
