import { createPromise, createPromiseId, execPromise } from './lib'
import { events } from './constants/events'
import { newBodies } from './lib/creators'
import { update } from 'three-kit'
import { updateDebugDrawer } from './debug/renderer'
import { updateDynamicBodies } from './lib/dynamic'
import { worker } from './lib/worker'

export * from './lib/appliers'
export * from './lib/creators'
export * from './lib/setters'
export * from './types'

export { count } from './lib'
export { dynamicCount } from './lib/dynamic'
export { ColliderType } from './constants/collider'
export {
  ActiveCollisionTypes, ActiveEvents, RigidBodyType
} from '@dimforge/rapier3d-compat'

type Listener = (...args: any) => void
type Events = 'collisionStart' | 'collisionEnd'

const eventmap = new Map<Events, Map<number, Listener[]>>()
eventmap.set('collisionStart', new Map())
eventmap.set('collisionEnd', new Map())

let currentFps = 0
let isRunning = false

/**
 * Registers an event listener.
 *
 * @param name The event name.
 * @param callback A callback that fires when the event is triggered.
 */
export const on = (name: Events, id: number, callback: Listener) => {
  const type = eventmap.get(name)!

  if (!type.has(id)) {
    type.set(id, [])
  }

  type.get(id)!.push(callback)
}

const emit = (name: Events, id: number, data: any) => {
  const type = eventmap.get(name)!
  const callbacks = type.get(id)

  if (callbacks === undefined) {
    return
  }

  for (let i = 0, l = callbacks.length; i < l; i += 1) {
    callbacks[i](data)
  }
}

const emitCollisionEvents = (collisions: Float32Array) => {
  for (let i = 0, l = collisions.length; i < l; i += 3) {
    const id1 = collisions[i + 0]
    const id2 = collisions[i + 1]
    const start = collisions[i + 2] === 1

    if (start) {
      emit('collisionStart', id1, id2)
    } else {
      emit('collisionEnd', id1, id2)
    }
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

const tick = () => {
  if (newBodies.length > 0) {
    const chunk = newBodies.splice(0, 200)
    worker.postMessage({
      bodies: chunk,
      event: events.CREATE_RIGIDBODIES,
    })
  }
}

worker.addEventListener('message', (message) => {
  const { data } = message

  switch (data.event) {
  case events.INIT:
    update(tick)
    return execPromise(data)
  case events.DEBUG_DRAW:
    return updateDebugDrawer(data)
  case events.FPS:
    currentFps = data.fps
    return undefined
  case events.RUN:
    return execPromise(data)
  case events.TRANSFORMS:
    emitCollisionEvents(new Float32Array(data.collisions))
    return updateDynamicBodies(new Float32Array(data.transforms))
  default:
    throw new Error(`Unhandled event ${data.event}`)
  }
})
