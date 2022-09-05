import { createPromise, createPromiseId, execPromise } from './lib'
import { emit } from './lib/events'
import { events } from './constants/events'
import { newBodies } from './lib/creators'
import { update } from 'three-kit'
import { updateDebugDrawer } from './debug/renderer'
import { updateDynamicBodies } from './lib/dynamic'
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

type Listener = (...args: any) => void
type Events = 'start' | 'end'

const eventmap = new Map<Events, Map<number, Listener[]>>()
eventmap.set('start', new Map())
eventmap.set('end', new Map())

let currentFps = 0
let isRunning = false

export const onCollision = (event: 'start' | 'end', id: number, callback: Listener) => {
  const type = eventmap.get(event)!
  const result = type.get(id)

  if (result === undefined) {
    type.set(id, [callback])
  } else {
    result.push(callback)
  }
}

const emitCollision = (name: Events, id: number, data?: unknown) => {
  const type = eventmap.get(name)!
  const callbacks = type.get(id)

  if (callbacks === undefined) {
    return
  }

  for (let i = 0, l = callbacks.length; i < l; i += 1) {
    callbacks[i](data)
  }
}

const emitContact = (
  name: Events, id: number, id2: number,
  p1x: number, p1y: number, p1z: number,
  p2x: number, p2y: number, p2z: number
) => {
  const type = eventmap.get(name)!
  const callbacks = type.get(id)

  if (callbacks === undefined) {
    return
  }

  for (let i = 0, l = callbacks.length; i < l; i += 1) {
    callbacks[i](id2, p1x, p1y, p1z, p2x, p2y, p2z)
  }
}

const emitCollisionEvents = (collisions: Float32Array, contacts: Float32Array) => {
  for (let i = 0, l = collisions.length; i < l; i += 3) {
    const id1 = collisions[i + 0]
    const id2 = collisions[i + 1]
    const start = collisions[i + 2] === 1

    emitCollision(start ? 'start' : 'end', id1, id2)
  }

  for (let i = 0, l = contacts.length; i < l; i += 9) {
    const id1 = contacts[i + 0]
    const id2 = contacts[i + 1]
    const start = contacts[i + 2] === 1

    emitContact(
      start ? 'start' : 'end', id1, id2,
      contacts[i + 3], contacts[i + 4], contacts[i + 5],
      contacts[i + 6], contacts[i + 7], contacts[i + 8]
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
export const destroyAllRigidBodies = () => {
  const pid = createPromiseId()
  // @TODO free bodies in this thread
  worker.postMessage({
    event: events.DESTROY_ALL_RIGIDBODIES,
    pid,
  })
  return createPromise<undefined>(pid)
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
      new Float32Array(data.collisions),
      new Float32Array(data.contacts)
    )
    return updateDynamicBodies(new Float32Array(data.transforms))
  case events.GET_VELOCITIES:
    return execPromise(data.pid, new Float32Array(data.buffer))
  default:
    throw new Error(`Unhandled event ${data.event}`)
  }
})
