import * as THREE from 'three'
import * as constants from '../constants'
import * as sword from '../../src/main'
import { randomColor } from './lib/colors'
import { mesh, indices, vertices } from './lib/meshes'

const m4 = new THREE.Matrix4()
const matrix = new THREE.Matrix4()

m4.copy(mesh.matrixWorld).invert()

const color = new THREE.Color()
const size = 20
const half = size / 2

for (let index = 0; index < constants.NUM_MESHES; index += 1) {
  color.set(randomColor())
  mesh.setColorAt(index, color)
  matrix.setPosition(
    (Math.random() * size) - half,
    (Math.random() * size),
    (Math.random() * size) - half
  )
  mesh.setMatrixAt(index, matrix)
}

mesh.instanceMatrix.needsUpdate = true
mesh.instanceColor!.needsUpdate = true

await sword.createRigidBodies(mesh, {
  type: sword.RigidBodyType.Dynamic,
  collider: sword.ColliderType.Trimesh,
  vertices,
  indices,
})
