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

interface WorkerOptions {
  canSleep: boolean
  ccd: boolean
  events: number
  instances: Transform[]
  sensor: boolean
  type: RigidBodyTypes
}

export interface PrimitiveRigidBodyWorkerOptions extends WorkerOptions {
  collider: Omit<ColliderTypes, ColliderType.Trimesh | ColliderType.ConvexHull>
  // This is radius | hx
  collider1: number
  // This is halfHeight | hy
  collider2: number
  // This is hz
  collider3: number
}

export interface VertexRigidBodyWorkerOptions extends WorkerOptions {
  collider: ColliderType.Trimesh | ColliderType.ConvexHull
  indices?: Uint32Array
  vertices: Float32Array
}

export type RigidBodyWorkerOptions =
  | PrimitiveRigidBodyWorkerOptions
  | VertexRigidBodyWorkerOptions
