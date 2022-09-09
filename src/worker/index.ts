import type { RigidBodyWorkerOptions, Transform } from '../types/internal'
import {
  applyImpulses, applyLinearAndTorqueImpulses, applyTorqueImpulses
} from './appliers'
import { bodies, bodymap, collidermap, handleMap, reportContact } from './bodies'
import {
  setActiveCollisionTypes,
  setNextKinematicTransforms,
  setTransforms,
  setTransformsAndVelocities,
  setTranslations,
  setVelocities
} from './setters'
import { ActiveEvents } from '../constants/active-events'
import RAPIER from '@dimforge/rapier3d-compat'
import { RigidBodyType } from '../constants/rigidbody'
import { bitmask } from '../lib/bitmask'
import { createCollider } from './colliders'
import { events } from '../constants/events'
import { getVelocities } from './getters'


let world: RAPIER.World | undefined
let eventQueue: RAPIER.EventQueue
let now = 0
let then = 0
let fps = 0
let tickId = -1
let debugTickId = -1

const timestep = 1000 / Number.parseInt(import.meta.env.SWORD_FPS ?? '60', 10)
const debugSlowdown = Number.parseFloat(import.meta.env.SWORD_DEBUG_SLOWDOWN ?? '3')
const defaultGravity = Number.parseFloat(import.meta.env.DEFAULT_GRAVITY ?? '-9.8')

const init = async (pid: number, x = 0, y = defaultGravity, z = 0) => {
  await RAPIER.init()

  world = new RAPIER.World({ x, y, z })
  world.timestep = timestep / 1000

  eventQueue = new RAPIER.EventQueue(true)

  self.postMessage({
    event: events.INIT,
    pid,
  })
}

const tick = () => {
  world!.step(eventQueue)

  now = performance.now()
  fps = 1000 / (now - then)
  then = now

  const transforms = new Float32Array(bodies.length * 8)

  let cursor = 0

  for (let i = 0, l = bodies.length; i < l; i += 1) {
    const body = bodies[i]

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

  const collisionStart: number[] = []
  const conllisionEnd: number[] = []
  const contactStart: number[] = []

  eventQueue.drainCollisionEvents((handle1, handle2, started) => {
    const id1 = handleMap.get(handle1)!
    const id2 = handleMap.get(handle2)!

    if (started && reportContact.get(id1)) {
      const collider1 = collidermap.get(id1)!
      const collider2 = collidermap.get(id2)!

      world!.contactPair(collider1, collider2, (manifold, flipped) => {
        let point1 = manifold.localContactPoint1(0)
        let point2 = manifold.localContactPoint2(0)

        if (point1 !== null && point2 !== null) {
          if (flipped) {
            const temp = point1
            point1 = point2
            point2 = temp
          }

          contactStart.push(
            id1,
            id2,
            point1.x,
            point1.y,
            point1.z,
            point2.x,
            point2.y,
            point2.z
          )
        }
      })
    } else if (started) {
      collisionStart.push(id1, id2)
    } else {
      conllisionEnd.push(id1, id2)
    }
  })

  const collisionStartArray = new Float32Array(contactStart)
  const collisionEndArray = new Float32Array(conllisionEnd)
  const contactStartArray = new Float32Array(contactStart)

  self.postMessage({
    collisionEnd: collisionEndArray,
    collisionStart: collisionStartArray,
    contactStart: contactStartArray,
    event: events.TRANSFORMS,
    transforms,
  }, [
    collisionEndArray.buffer,
    collisionStartArray.buffer,
    contactStartArray.buffer,
    transforms.buffer,
  ])
}

const debugTick = () => {
  if (world === undefined) {
    return
  }

  const { colors, vertices } = world.debugRender()

  self.postMessage({
    colors,
    event: events.DEBUG_DRAW,
    vertices,
  }, [vertices.buffer, colors.buffer])
}

const run = (pid: number) => {
  now = performance.now()
  then = now
  tickId = self.setInterval(tick, timestep)

  postMessage({
    event: events.RUN,
    pid,
  })
}

const setDebugDraw = (on: boolean, slowdown = debugSlowdown) => {
  if (on) {
    debugTickId = self.setInterval(debugTick, timestep * slowdown)
  } else {
    clearInterval(debugTickId)
  }
}

const pause = (pid: number) => {
  clearInterval(tickId)

  postMessage({
    event: events.PAUSE,
    pid,
  })
}

const mapType = (type: RigidBodyType) => {
  switch (type) {
  case RigidBodyType.Dynamic:
    return RAPIER.RigidBodyType.Dynamic
  case RigidBodyType.KinematicPositionBased:
    return RAPIER.RigidBodyType.KinematicPositionBased
  case RigidBodyType.KinematicVelocityBased:
    return RAPIER.RigidBodyType.KinematicVelocityBased
  case RigidBodyType.Fixed:
  case RigidBodyType.Sensor:
    return RAPIER.RigidBodyType.Fixed
  }
}

const createMask = (groups: number[], filter: number[]) => {
  const bits = new Array(32).fill(0)

  for (let i = 0, l = groups.length; i < l; i += 1) {
    bits[groups[i]] = 1
  }

  for (let i = 0, l = filter.length; i < l; i += 1) {
    bits[16 + filter[i]] = 1
  }

  return bitmask.create(bits)
}

const createRigidBody = (
  transform: Transform,
  options: RigidBodyWorkerOptions
) => {
  const bodyDescription = new RAPIER.RigidBodyDesc(mapType(options.type))
    .setTranslation(transform.x, transform.y, transform.z)
    .setRotation({
      w: transform.qw,
      x: transform.qx,
      y: transform.qy,
      z: transform.qz,
    })
    .setCanSleep(options.canSleep)
    .setCcdEnabled(options.ccd)

  const colliderDescription = createCollider(options)!
    .setDensity(options.density)
    .setFriction(0.2)
    .setFrictionCombineRule(RAPIER.CoefficientCombineRule.Max)
    .setRestitution(0.5)
    .setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Max)
    .setSensor(options.type === RigidBodyType.Sensor)

  if (options.groups.length > 0 || options.filter.length > 0) {
    const mask = createMask(options.groups, options.filter)
    colliderDescription.setCollisionGroups(mask)
  }

  const rigidBody = world!.createRigidBody(bodyDescription)
  const collider = world!.createCollider(colliderDescription, rigidBody)

  if (options.events === ActiveEvents.CONTACT_EVENTS) {
    collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
    reportContact.set(transform.id, true)
  } else if (options.events > -1) {
    collider.setActiveEvents(options.events)
  } else {
    // @TODO ???
    collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
  }

  if (options.type === RigidBodyType.Dynamic) {
    bodies.push(rigidBody)
  }

  rigidBody.userData = transform.id
  bodymap.set(transform.id, rigidBody)
  collidermap.set(transform.id, collider)
  handleMap.set(rigidBody.handle, transform.id)
}

const createRigidBodies = (bodyOptions: RigidBodyWorkerOptions[]) => {
  for (let i = 0, l = bodyOptions.length; i < l; i += 1) {
    const options = bodyOptions[i]
    for (let j = 0, jl = options.instances.length; j < jl; j += 1) {
      createRigidBody(options.instances[j], options)
    }
  }
}

const destroyAllRigidBodies = (pid: number) => {
  bodies.splice(0, bodies.length)
  bodymap.clear()
  collidermap.clear()
  handleMap.clear()
  reportContact.clear()
  world!.bodies.free()

  postMessage({
    event: events.DESTROY_ALL_RIGIDBODIES,
    pid,
  })
}

const setGravity = (x: number, y: number, z: number) => {
  world!.gravity.x = x
  world!.gravity.y = y
  world!.gravity.z = z
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
  case events.SET_DEBUG_DRAW:
    return setDebugDraw(data.on, data.slowdown)
  case events.CREATE_RIGIDBODIES:
    return createRigidBodies(data.bodies)
  case events.DESTROY_ALL_RIGIDBODIES:
    return destroyAllRigidBodies(data.pid)
  case events.APPLY_IMPULSES:
    return applyImpulses(data.impulses)
  case events.APPLY_TORQUE_IMPULSES:
    return applyTorqueImpulses(data.impulses)
  case events.APPLY_LINEAR_AND_TORQUE_IMPULSES:
    return applyLinearAndTorqueImpulses(data.impulses)
  case events.GET_VELOCITIES:
    return getVelocities(data.ids, data.pid)
  case events.SET_ACTIVE_COLLISION_TYPES:
    return setActiveCollisionTypes(data.id, data.types)
  case events.SET_GRAVITY:
    return setGravity(data.x, data.y, data.z)
  case events.SET_NEXT_KINEMATIC_TRANSFORMS:
    return setNextKinematicTransforms(data.transforms)
  case events.SET_TRANSLATIONS:
    return setTranslations(data.translations, data.resetAngvel, data.resetLinvel)
  case events.SET_TRANSFORMS:
    return setTransforms(data.transforms)
  case events.SET_TRANSFORMS_AND_VELOCITIES:
    return setTransformsAndVelocities(data.array)
  case events.SET_VELOCITIES:
    return setVelocities(data.velocities)
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
