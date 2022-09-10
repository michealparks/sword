import * as THREE from 'three'
import * as constants from '../constants'
import * as sword from '../../src/main'
import { randomColor } from './lib/colors'
import { mesh, radius } from './lib/spheres'

sword.setGravity(0, 0, 0)

const matrix = new THREE.Matrix4()
const color = new THREE.Color()

const size = 15

const random = () => {
  return Math.random() * size - (size / 2)
}

for (let index = 0; index < constants.NUM_MESHES; index += 1) {
  color.set(randomColor())
  mesh.setColorAt(index, color)
  matrix.setPosition(random(), random() + (size / 2), random())
  mesh.setMatrixAt(index, matrix)
}

mesh.instanceColor!.needsUpdate = true

const ids = await sword.createRigidBodies(mesh, {
  type: sword.RigidBodyType.Dynamic,
  collider: sword.ColliderType.Ball,
  radius,
  canSleep: false,
  filter: [0, 1],
  groups: [1],
})

const impulses = new Float32Array(ids.length * 6)

const random2 = () => {
  return (Math.random() - 0.5) * 2
}

for (let i = 0, j = 0, l = ids.length; i < l; i += 1, j += 6) {
  impulses[j + 0] = random2()
  impulses[j + 1] = random2()
  impulses[j + 2] = random2()
  impulses[j + 3] = random2()
  impulses[j + 4] = random2()
  impulses[j + 5] = random2()
}

sword.applyLinearAndTorqueImpulses(ids, impulses)

