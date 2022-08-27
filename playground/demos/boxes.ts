import * as THREE from 'three'
import * as constants from '../constants'
import * as sword from '../../src/main'
import { randomColor } from './lib/colors'
import { boxes, halfExtents } from './lib/boxes'

const color = new THREE.Color()
const matrix = new THREE.Matrix4()

const size = 15
const halfSize = size / 2
for (let index = 0; index < constants.NUM_MESHES; index += 1) {
  color.set(randomColor())
  boxes.setColorAt(index, color)
  matrix.setPosition(
    Math.random() * size - halfSize,
    Math.random() * size + 0.5,
    Math.random() * size - halfSize)
  boxes.setMatrixAt(index, matrix)
}

boxes.instanceColor!.needsUpdate = true

sword.createRigidBodies(boxes, {
  ccd: true,
  type: sword.RigidBodyType.Dynamic,
  collider: sword.ColliderType.Cuboid,
  hx: halfExtents,
  hy: halfExtents,
  hz: halfExtents,
})
