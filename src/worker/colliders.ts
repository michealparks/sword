import { ColliderDesc } from '@dimforge/rapier3d-compat'
import { ColliderType } from '../constants/collider'
import type { RigidBodyWorkerOptions } from '../types/internal'

export const createCollider = (options: RigidBodyWorkerOptions) => {
  switch (options.collider) {
  case ColliderType.Ball:
    return ColliderDesc.ball(options.collider1)
  case ColliderType.Capsule:
    return ColliderDesc.capsule(options.collider2, options.collider1)
  case ColliderType.Cone:
    return ColliderDesc.cone(options.collider2, options.collider1)
  case ColliderType.ConvexHull:
    return ColliderDesc.convexHull(options.vertices)
  case ColliderType.Cuboid:
    return ColliderDesc.cuboid(options.collider1, options.collider2, options.collider3)
  case ColliderType.Cylinder:
    return ColliderDesc.cylinder(options.collider2, options.collider1)
  case ColliderType.Heightfield:
    return ColliderDesc.heightfield(
      options.collider1,
      options.collider2,
      options.vertices,
      {
        x: 1,
        y: 1,
        z: 1,
      }
    )
  case ColliderType.Trimesh:
    return ColliderDesc.trimesh(options.vertices, options.indices ?? new Uint32Array(0))
  }

  throw new Error('bodytype not supported')
}
