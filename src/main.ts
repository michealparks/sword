import * as THREE from 'three'
import type { Impulse, RigidBodyOptions } from './types/internal'
import { createBodyId, createPromise, createPromiseId, execPromise } from './lib'
import { registerDynamicBody, updateDynamicBodies } from './lib/dynamic'
import type { RigidBodyParams } from './types'
import { RigidBodyType } from '@dimforge/rapier3d-compat'
import { events } from './constants/events'
import { update } from 'three-kit'
import { updateDebugDrawer } from './debug/renderer'
import { worker } from './lib/worker'

export { count } from './lib'
export { dynamicCount } from './lib/dynamic'
export { shapes } from './constants/shapes'
export * from './types'
export { RigidBodyType } from '@dimforge/rapier3d-compat'

type Event = (ids: number[]) => void

const eventmap = new Map<string, Set<any>>()
eventmap.set('debugDraw', new Set())

const sensorEvents = new Map<number, { enter: Event, leave: Event }>()
const newBodies: RigidBodyOptions[] = []
const newImpulses: Impulse[] = []
const m4 = new THREE.Matrix4()
const vec3 = new THREE.Vector3()
const quat = new THREE.Quaternion()

let currentFps = 0
let isRunning = false

/**
 * Registers an event listener.
 *
 * @param name The event name.
 * @param callback A callback that fires when the event is triggered.
 */
export const on = (name: 'collisions', callback: (...args: any) => void) => {
  // @ts-expect-error Should be defined
  eventmap.get(name).add(callback)
}

const emit = (name: string, data: any) => {
  // @ts-expect-error Should be defined
  for (const callback of eventmap.get(name)) {
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

/**
 * 
 * @param options {RigidBodyParams}
 * @param sensor 
 * @returns 
 */
export const createRigidBody = (options: RigidBodyParams, sensor = false) => {
  const { mesh, canSleep = true, ccd = false } = options
  const ids = []

  if (mesh instanceof THREE.InstancedMesh) {
    for (let i = 0, l = mesh.count; i < l; i += 1) {
      const id = createBodyId()
      mesh.getMatrixAt(i, m4)
      quat.setFromRotationMatrix(m4)
      vec3.setFromMatrixPosition(m4)
      newBodies.push({
        canSleep,
        ccd,
        halfHeight: options.halfHeight ?? 0,
        hx: options.hx ?? 0,
        hy: options.hy ?? 0,
        hz: options.hz ?? 0,
        id,
        qw: quat.w,
        qx: quat.x,
        qy: quat.y,
        qz: quat.z,
        radius: options.radius ?? 0,
        sensor,
        shape: options.shape,
        type: options.type,
        x: vec3.x,
        y: vec3.y,
        z: vec3.z,
      })
      ids.push(id)
    }
  } else {
    const { position, quaternion } = mesh
    const id = createBodyId()
    newBodies.push({
      canSleep,
      ccd,
      halfHeight: options.halfHeight ?? 0,
      hx: options.hx ?? 0,
      hy: options.hy ?? 0,
      hz: options.hz ?? 0,
      id,
      qw: quaternion.w,
      qx: quaternion.x,
      qy: quaternion.y,
      qz: quaternion.z,
      radius: options.radius ?? 0,
      sensor,
      shape: options.shape,
      type: options.type,
      x: position.x,
      y: position.y,
      z: position.z,
    })
    ids.push(id)
  }

  if (options.type === RigidBodyType.Dynamic) {
    registerDynamicBody(mesh)
  }

  return ids
}

export const createSensor = (options: RigidBodyParams, enter: Event, leave: Event) => {
  const ids = createRigidBody(options)
  sensorEvents.set(ids[0], {
    enter,
    leave,
  })
  return ids
}

export const applyImpulse = (id: number, x: number, y: number, z: number) => {
  newImpulses.push({
    id,
    x,
    y,
    z,
  })
}

export const applyImpulses = (impulses: Float32Array) => {
  worker.postMessage({
    buffer: impulses.buffer,
    event: events.APPLY_IMPULSES,
  }, [impulses.buffer])
}

export const applyTorqueImpulses = (impulses: Float32Array) => {
  worker.postMessage({
    buffer: impulses.buffer,
    event: events.APPLY_TORQUE_IMPULSES,
  }, [impulses.buffer])
}

export const applyLinearAndTorqueImpulses = (impulses: Float32Array) => {
  worker.postMessage({
    buffer: impulses.buffer,
    event: events.APPLY_LINEAR_AND_TORQUE_IMPULSES,
  }, [impulses.buffer])
}

const tick = () => {
  if (newBodies.length > 0) {
    const chunk = newBodies.splice(0, 100)
    worker.postMessage({
      bodies: chunk,
      event: events.CREATE_RIGIDBODIES,
    })
  }

  if (newImpulses.length > 0) {
    const chunk = newImpulses.splice(0, 100)
    worker.postMessage({
      event: events.APPLY_IMPULSES,
      impulses: chunk,
    })
  }
}

/**
 * Sets the gravity of the physics world.
 *
 * @param x The gravity x component.
 * @param y The gravity y component.
 * @param z The gravity z component.
 */
export const setGravity = (x: number, y: number, z: number) => {
  worker.postMessage({
    event: events.SET_GRAVITY,
    x,
    y,
    z,
  })
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
