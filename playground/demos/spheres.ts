import * as THREE from 'three'
import * as constants from '../constants'
import * as sword from '../../src/main'
import { randomColor } from './lib/colors'
import { mesh, radius } from './lib/spheres'

const color = new THREE.Color()
const matrix = new THREE.Matrix4()

const size = 10
const half = size / 2

for (let index = 0; index < constants.NUM_MESHES; index += 1) {
  color.set(randomColor())
  mesh.setColorAt(index, color)
  matrix.setPosition(
    Math.random() * size - half,
    Math.random() * size,
    Math.random() * size - half,
  )
  mesh.setMatrixAt(index, matrix)
}

mesh.instanceColor!.needsUpdate = true

sword.createRigidBodies(mesh, {
  type: sword.RigidBodyType.Dynamic,
  collider: sword.ColliderType.Ball,
  radius,
})
