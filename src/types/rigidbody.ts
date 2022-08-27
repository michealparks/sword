import type { RigidBodyType } from '@dimforge/rapier3d-compat'
import type { shapes } from '../constants/shapes'

type RigidBodyTypes = 
  | RigidBodyType.Dynamic
  | RigidBodyType.Fixed
  | RigidBodyType.KinematicPositionBased
  | RigidBodyType.KinematicVelocityBased

export interface RigidBodyOptions {
  type: RigidBodyTypes
}

export interface RigidBodyParams {
  canSleep?: boolean
  ccd?: boolean
  halfHeight?: number
  hx?: number
  hy?: number
  hz?: number
  mesh: THREE.Mesh | THREE.InstancedMesh
  radius?: number
  shape: shapes
  type: RigidBodyTypes
}
