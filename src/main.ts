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
export { RigidBodyType } from '@dimforge/rapier3d-compat'

const eventmap = new Map<string, Set<any>>()
eventmap.set('debugDraw', new Set())

let currentFps = 0
let isRunning = false

/**
 * Registers an event listener.
 *
 * @param name The event name.
 * @param callback A callback that fires when the event is triggered.
 */
export const on = (name: 'collisions', callback: (...args: any) => void) => {
  eventmap.get(name)!.add(callback)
}

const emit = (name: string, data: any) => {
  for (const callback of eventmap.get(name)!) {
    callback(data)
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
    return updateDynamicBodies(new Float32Array(data.buffer))
  default:
    throw new Error(`Unhandled event ${data.event}`)
  }
})
