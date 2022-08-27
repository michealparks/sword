import RAPIER from '@dimforge/rapier3d-compat'
import { shapes } from '../constants/shapes'

export const createCollider = (body) => {
  switch (body.shape) {
  case shapes.BALL:
    return RAPIER.ColliderDesc.ball(body.radius)
  case shapes.CAPSULE:
    return RAPIER.ColliderDesc.capsule(body.halfHeight, body.radius)
  case shapes.CUBOID:
    return RAPIER.ColliderDesc.cuboid(body.hx, body.hy, body.hz)
  default:
    throw new Error(`Unsupported shape ${body.shape}!`)
  }
}
