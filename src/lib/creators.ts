import * as THREE from 'three'
import { createPromise, createPromiseId } from '.'
import { registerDynamicBody, registerInstancedDynamicBody } from './dynamic'
import type { RigidBodiesTypeOptions } from '../types/rigidbody'
import { RigidBodyType } from '../constants/rigidbody'
import type { RigidBodyWorkerOptions } from '../types/internal'
import { events } from '../constants/events'
import { worker } from './worker'

export const sensorEvents = new Map<number, { enter: Event, leave: Event }>()
const m4 = new THREE.Matrix4()
const vec3 = new THREE.Vector3()
const quat = new THREE.Quaternion()

/**
 *
 * @param object A THREE.Mesh
 * @param options {RigidBodyParams}
 * @returns a list of ids
 */
export const createRigidBody = async (
  object: THREE.Object3D,
  options: RigidBodiesTypeOptions
): Promise<number> => {
  const { position, quaternion } = object

  const instances = new Float32Array(7)
  instances[0] = position.x
  instances[1] = position.y
  instances[2] = position.z
  instances[3] = quaternion.x
  instances[4] = quaternion.y
  instances[5] = quaternion.z
  instances[6] = quaternion.w

  const pid = createPromiseId()

  worker.postMessage({
    canSleep: options.canSleep ?? true,
    ccd: options.ccd ?? false,
    collider: options.collider,
    collider1: 'hx' in options ? options.hx : 'radius' in options ? options.radius : 0,
    collider2: 'hy' in options ? options.hy : 'halfHeight' in options ? options.halfHeight : 0,
    collider3: 'hz' in options ? options.hz : 0,
    density: options.density ?? 1,
    disabled: options.disabled,
    event: events.CREATE_RIGIDBODIES,
    events: options.events ?? -1,
    filter: options.filter,
    groups: options.groups,
    indices: 'indices' in options ? options.indices : undefined,
    instances,
    pid,
    type: options.type,
    vertices: 'vertices' in options ? options.vertices : undefined,
  } as RigidBodyWorkerOptions, [instances.buffer])

  const ids = await createPromise<Uint16Array>(pid)

  if (options.type === RigidBodyType.Dynamic) {
    registerDynamicBody(object, ids[0]!)
  }

  return ids[0]!
}

export const createRigidBodies = async (mesh: THREE.InstancedMesh, options: RigidBodiesTypeOptions): Promise<Uint16Array> => {
  const instances = new Float32Array(mesh.count * 7)

  for (let i = 0, j = 0, l = mesh.count; i < l; i += 1, j += 7) {
    mesh.getMatrixAt(i, m4)
    quat.setFromRotationMatrix(m4)
    vec3.setFromMatrixPosition(m4)
    instances[j + 0] = vec3.x
    instances[j + 1] = vec3.y
    instances[j + 2] = vec3.z
    instances[j + 3] = quat.x
    instances[j + 4] = quat.y
    instances[j + 5] = quat.z
    instances[j + 6] = quat.w
  }

  const pid = createPromiseId()

  worker.postMessage({
    canSleep: options.canSleep ?? true,
    ccd: options.ccd ?? false,
    collider: options.collider,
    collider1: 'hx' in options ? options.hx : 'radius' in options ? options.radius : 0,
    collider2: 'hy' in options ? options.hy : 'halfHeight' in options ? options.halfHeight : 0,
    collider3: 'hz' in options ? options.hz : 0,
    density: options.density ?? 1,
    disabled: options.disabled,
    event: events.CREATE_RIGIDBODIES,
    events: options.events ?? -1,
    filter: options.filter,
    groups: options.groups,
    indices: 'indices' in options ? options.indices : undefined,
    instances,
    pid,
    type: options.type,
    vertices: 'vertices' in options ? options.vertices : undefined,
  } as RigidBodyWorkerOptions, [instances.buffer])

  const ids = await createPromise<Uint16Array>(pid)

  if (options.type === RigidBodyType.Dynamic) {
    registerInstancedDynamicBody(mesh, ids)
  }

  return ids
}
