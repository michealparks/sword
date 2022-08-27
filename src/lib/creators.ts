import * as THREE from 'three'
import { registerDynamicBody, registerInstancedDynamicBody } from './dynamic'
import { ColliderType } from '../constants/collider'
import type { RigidBodiesTypeOptions } from '../types/rigidbody'
import { RigidBodyType } from '@dimforge/rapier3d-compat'
import type { RigidBodyWorkerOptions } from '../types/internal'
import { createBodyId } from '.'


export const newBodies: RigidBodyWorkerOptions[] = []
export const sensorEvents = new Map<number, { enter: Event, leave: Event }>()
const m4 = new THREE.Matrix4()
const vec3 = new THREE.Vector3()
const quat = new THREE.Quaternion()

/**
 *
 * @param mesh A THREE.Mesh
 * @param options {RigidBodyParams}
 * @returns a list of ids
 */
export const createRigidBody = (
  mesh: THREE.Mesh,
  options: RigidBodiesTypeOptions
) => {
  const { position, quaternion } = mesh
  const id = createBodyId()

  newBodies.push({
    canSleep: options.canSleep ?? true,
    ccd: options.ccd ?? false,
    collider: options.collider,
    collider1: options.hx ?? options.radius,
    collider2: options.hy ?? options.halfHeight,
    collider3: options.hz,
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
    sensor: options.sensor ?? false,
    type: options.type,
  })

  if (options.type === RigidBodyType.Dynamic) {
    registerDynamicBody(mesh, id)
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

  if (options.collider === ColliderType.Trimesh) {
    newBodies.push({
      canSleep: options.canSleep ?? true,
      ccd: options.ccd ?? false,
      collider: options.collider,
      indices: options.indices ?? new Uint32Array(0),
      instances,
      sensor: options.sensor ?? false,
      type: options.type,
      vertices: options.vertices,
    })
  } else {
    newBodies.push({
      canSleep: options.canSleep ?? true,
      ccd: options.ccd ?? false,
      collider: options.collider,
      collider1: options.hx ?? options.radius,
      collider2: options.hy ?? options.halfHeight,
      collider3: options.hz,
      instances,
      sensor: options.sensor ?? false,
      type: options.type,
    })
  }

  if (options.type === RigidBodyType.Dynamic) {
    registerInstancedDynamicBody(mesh, ids)
  }

  return ids
}
