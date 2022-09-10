import type { ActiveEvents } from '../constants/active-events'
import type { ColliderType } from '../constants/collider'
import type { RigidBodyType } from '../constants/rigidbody'

export type ColliderTypes =
  | ColliderType.Ball
  | ColliderType.Capsule
  | ColliderType.Cone
  | ColliderType.ConvexHull
  | ColliderType.Cuboid
  | ColliderType.Cylinder
  | ColliderType.Heightfield
  | ColliderType.Trimesh

export type RigidBodyTypes =
  | RigidBodyType.Dynamic
  | RigidBodyType.Fixed
  | RigidBodyType.KinematicPositionBased
  | RigidBodyType.KinematicVelocityBased
  | RigidBodyType.Sensor

export interface RigidBodyOptions {
  canSleep?: boolean
  ccd?: boolean
  density?: number
  disabled?: boolean
  events?: ActiveEvents
  filter?: number[]
  groups?: number[]
  type: RigidBodyTypes
}

export interface BallRigidBodyOptions extends RigidBodyOptions {
  collider: ColliderType.Ball
  radius: number
}

export interface CapsuleRigidBodyOptions extends RigidBodyOptions {
  collider: ColliderType.Capsule
  halfHeight: number
  radius: number
}

export interface ConeRigidBodyOptions extends RigidBodyOptions {
  collider: ColliderType.Cone
  halfHeight: number
  radius: number
}

export interface ConvexHullRigidBodyOptions extends RigidBodyOptions {
  collider: ColliderType.ConvexHull
  vertices: Float32Array
}

export interface CuboidRigidBodyOptions extends RigidBodyOptions {
  collider: ColliderType.Cuboid
  hx: number
  hy: number
  hz: number
}

export interface CylinderRigidBodyOptions extends RigidBodyOptions {
  collider: ColliderType.Cylinder
  halfHeight: number
  radius: number
}

export interface TrimeshRigidBodyOptions extends RigidBodyOptions {
  collider: ColliderType.Trimesh
  vertices: Float32Array
  indices?: Uint32Array
}

export type RigidBodiesTypeOptions =
  | BallRigidBodyOptions
  | CapsuleRigidBodyOptions
  | ConeRigidBodyOptions
  | ConvexHullRigidBodyOptions
  | CuboidRigidBodyOptions
  | CylinderRigidBodyOptions
  | TrimeshRigidBodyOptions
