import { ColliderType } from '../constants/collider'
import RAPIER from '@dimforge/rapier3d-compat'
import type { RigidBodyWorkerOptions } from '../types/internal'

export const createCollider = (body: RigidBodyWorkerOptions) => {
  switch (body.collider) {
  case ColliderType.Ball:
    return RAPIER.ColliderDesc.ball(body.collider1)
  case ColliderType.Capsule:
    return RAPIER.ColliderDesc.capsule(body.collider2, body.collider1)
  case ColliderType.Cuboid:
    return RAPIER.ColliderDesc.cuboid(body.collider1, body.collider2, body.collider3)
  case ColliderType.Trimesh:
    return RAPIER.ColliderDesc.trimesh(body.vertices, body.indices)
  }

  throw new Error('bodytype not supported')
}
