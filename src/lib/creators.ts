import * as THREE from 'three'
import { registerDynamicBody, registerInstancedDynamicBody } from './dynamic'
import type { RigidBodiesTypeOptions } from '../types/rigidbody'
import { RigidBodyType } from '../constants/rigidbody'
import type { RigidBodyWorkerOptions } from '../types/internal'
import { createBodyId } from '.'

export const newBodies: RigidBodyWorkerOptions[] = []
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
export const createRigidBody = (
  object: THREE.Object3D,
  options: RigidBodiesTypeOptions
) => {
  const { position, quaternion } = object
  const id = createBodyId()

  newBodies.push({
    canSleep: options.canSleep ?? true,
    ccd: options.ccd ?? false,
    collider: options.collider,
    collider1: options.hx ?? options.radius,
    collider2: options.hy ?? options.halfHeight,
    collider3: options.hz,
    density: options.density ?? 1,
    events: options.events ?? -1,
    filter: options.filter ?? [],
    groups: options.groups ?? [],
    instances: [{
      id,
      qw: quaternion.w,
      qx: quaternion.x,
      qy: quaternion.y,
      qz: quaternion.z,
      x: position.x,
      y: position.y,
      z: position.z,
    }],
    type: options.type,
    vertices: options.vertices,
  })

  if (options.type === RigidBodyType.Dynamic) {
    registerDynamicBody(object, id)
  }

  return id
}

export const createRigidBodies = (
  mesh: THREE.InstancedMesh,
  options: RigidBodiesTypeOptions
) => {
  const ids = []
  const instances = []

  for (let i = 0, l = mesh.count; i < l; i += 1) {
    mesh.getMatrixAt(i, m4)
    quat.setFromRotationMatrix(m4)
    vec3.setFromMatrixPosition(m4)
    const id = createBodyId()
    ids.push(id)
    instances.push({
      id,
      qw: quat.w,
      qx: quat.x,
      qy: quat.y,
      qz: quat.z,
      x: vec3.x,
      y: vec3.y,
      z: vec3.z,
    })

    newBodies.push()
  }

  newBodies.push({
    canSleep: options.canSleep ?? true,
    ccd: options.ccd ?? false,
    collider: options.collider,
    collider1: options.hx ?? options.radius,
    collider2: options.hy ?? options.halfHeight,
    collider3: options.hz,
    density: options.density ?? 1,
    events: options.events ?? -1,
    filter: options.filter ?? [],
    groups: options.groups ?? [],
    indices: options.indices,
    instances,
    type: options.type,
    vertices: options.vertices,
  })

  if (options.type === RigidBodyType.Dynamic) {
    registerInstancedDynamicBody(mesh, ids)
  }

  return ids
}
