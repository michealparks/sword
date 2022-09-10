import type { ColliderTypes, RigidBodyTypes } from './rigidbody'
import type { ColliderType } from '../constants/collider'

interface WorkerOptions {
  canSleep: boolean
  ccd: boolean
  events: number
  density: number
  disabled?: boolean
  filter?: number[]
  groups?: number[]
  instances: Float32Array
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
