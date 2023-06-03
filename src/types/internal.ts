import type { RigidBodyTypes } from './rigidbody'
import { ColliderType } from '../constants/collider'

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
  collider: ColliderType.Ball | ColliderType.Capsule | ColliderType.Cone | ColliderType.Cuboid | ColliderType.Cylinder
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

export interface HeightfieldRigidBodyWorkerOptions extends WorkerOptions {
  collider: ColliderType.Heightfield
  collider1: number
  collider2: number
  indices?: Uint32Array
  vertices: Float32Array
}

export type RigidBodyWorkerOptions =
  | PrimitiveRigidBodyWorkerOptions
  | VertexRigidBodyWorkerOptions
  | HeightfieldRigidBodyWorkerOptions
