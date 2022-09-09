import { createPromise, createPromiseId, execPromise } from './lib'
import { disposeAllBodies, updateDynamicBodies } from './lib/dynamic'
import { emit } from './lib/events'
import { events } from './constants/events'
import { newBodies } from './lib/creators'
import { update } from 'three-kit'
import { updateDebugDrawer } from './debug/renderer'
import { worker } from './lib/worker'

export * from './lib/appliers'
export * from './lib/creators'
export * from './lib/events'
export * from './lib/getters'
export * from './lib/setters'
export * from './types'

export { count } from './lib'
export { dynamicCount } from './lib/dynamic'
export { ColliderType } from './constants/collider'
export { RigidBodyType } from './constants/rigidbody'
export { ActiveEvents } from './constants/active-events'
export { ActiveCollisionTypes } from '@dimforge/rapier3d-compat'

type Listener = (...args: unknown[]) => void
type Events = 'start' | 'end'

const eventmap = new Map<string, Listener[]>()

let currentFps = 0
let isRunning = false

export const onCollision = (event: 'start' | 'end', id: number, callback: Listener) => {
  const channel = eventmap.get(`${event}${id}`)

  if (channel === undefined) {
    eventmap.set(`${event}${id}`, [callback])
  } else {
    channel.push(callback)
  }
}

const emitCollision = (name: Events, id: number, id2: number) => {
  const channel = eventmap.get(`${name}${id}`)

  if (channel !== undefined) {
    for (let i = 0, l = channel.length; i < l; i += 1) {
      channel[i](id2)
    }
  }
}

const emitContact = (
  name: Events, id: number, id2: number,
  p1x: number, p1y: number, p1z: number,
  p2x: number, p2y: number, p2z: number
) => {
  const channel = eventmap.get(`${name}${id}`)

  if (channel !== undefined) {
    for (let i = 0, l = channel.length; i < l; i += 1) {
      channel[i](id2, p1x, p1y, p1z, p2x, p2y, p2z)
    }
  }
}

const emitCollisionEvents = (
  collisionStart: Float32Array,
  collisionEnd: Float32Array,
  contactStart: Float32Array
) => {
  for (let i = 0, l = collisionStart.length; i < l; i += 2) {
    emitCollision('start', collisionStart[i + 0], collisionStart[i + 1])
  }

  for (let i = 0, l = collisionEnd.length; i < l; i += 2) {
    emitCollision('end', collisionEnd[i + 0], collisionEnd[i + 1])
  }

  for (let i = 0, l = contactStart.length; i < l; i += 8) {
    const id1 = contactStart[i + 0]
    const id2 = contactStart[i + 1]

    emitContact(
      'start',
      id1,
      id2,
      contactStart[i + 2],
      contactStart[i + 3],
      contactStart[i + 4],
      contactStart[i + 5],
      contactStart[i + 6],
      contactStart[i + 7]
    )
  }
}

/**
 * Initializes the physics engine.
 *
 * @param x An optional x gravity force.
 * @param y An optional y gravity force.
 * @param z An optional z gravity force.
 * @returns A promise that resolves once the engine has been initialized.
 */
export const init = (x?: number, y?: number, z?: number) => {
  const pid = createPromiseId()

  worker.postMessage({
    event: events.INIT,
    pid,
    x,
    y,
    z,
  })

  return createPromise<undefined>(pid)
}

/**
 * Starts the engine's frame loop.
 *
 * @returns A promise that resolves once the engine is running.
 */
export const run = () => {
  const pid = createPromiseId()

  worker.postMessage({
    event: events.RUN,
    pid,
  })
  isRunning = true
  return createPromise<undefined>(pid)
}

/**
 * Pauses the engine's frame loop.
 *
 * @returns A promise that resolves once the engine is paused.
 */
export const pause = () => {
  const pid = createPromiseId()

  worker.postMessage({
    event: events.PAUSE,
    pid,
  })
  isRunning = false
  return createPromise<undefined>(pid)
}

/**
 * Gets the engine running state.
 *
 * @returns a boolean representing if the engine is running.
 */
export const running = () => {
  return isRunning
}

/**
 * Gets an approximation of the engine frame speed, updated once a second.
 *
 * @returns The engine speed in frames per second.
 */
export const fps = () => {
  return currentFps
}

/**
 * Frees all rigidbodies from memory.
 *
 * @returns A promise that resolves once all bodies are freed.
 */
export const destroyAllRigidBodies = async () => {
  const pid = createPromiseId()

  worker.postMessage({
    event: events.DESTROY_ALL_RIGIDBODIES,
    pid,
  })

  await createPromise<undefined>(pid)

  disposeAllBodies()
}

const tick = () => {
  if (newBodies.length > 0) {
    const chunk = newBodies.splice(0, 10)
    worker.postMessage({
      bodies: chunk,
      event: events.CREATE_RIGIDBODIES,
    })

    if (newBodies.length === 0) {
      emit('bodiesLoaded')
    }
  }
}

worker.addEventListener('message', (message) => {
  const { data } = message

  switch (data.event) {
  case events.INIT:
    update(tick)
    return execPromise(data.pid)
  case events.DEBUG_DRAW:
    return updateDebugDrawer(data)
  case events.FPS:
    currentFps = data.fps
    return undefined
  case events.RUN:
    return execPromise(data.pid)
  case events.TRANSFORMS:
    emitCollisionEvents(
      new Float32Array(data.collisionStart),
      new Float32Array(data.collisionEnd),
      new Float32Array(data.contactStart)
    )
    return updateDynamicBodies(new Float32Array(data.transforms))
  case events.GET_VELOCITIES:
    return execPromise(data.pid, new Float32Array(data.buffer))
  default:
    throw new Error(`Unhandled event ${data.event}`)
  }
})
