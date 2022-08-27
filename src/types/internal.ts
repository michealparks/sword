import type { ColliderTypes, RigidBodyTypes } from './rigidbody'
import type { ColliderType } from '../constants/collider'

export interface Transform {
  id: number
  qw: number
  qx: number
  qy: number
  qz: number
  x: number
  y: number
  z: number
}

export interface PrimitiveRigidBodyWorkerOptions {
  canSleep: boolean
  ccd: boolean
  collider: ColliderTypes
  // This is radius | hx
  collider1: number
  // This is halfHeight | hy
  collider2: number
  // This is hz
  collider3: number
  instances: Transform[]
  sensor: boolean
  type: RigidBodyTypes
}

export interface TriMeshRigidBodyWorkerOptions {
  canSleep: boolean
  ccd: boolean
  collider: ColliderType.Trimesh
  indices?: Uint32Array
  instances: Transform[]
  sensor: boolean
  type: RigidBodyTypes
  vertices: Float32Array
}

export type RigidBodyWorkerOptions =
  | PrimitiveRigidBodyWorkerOptions
  | TriMeshRigidBodyWorkerOptions
