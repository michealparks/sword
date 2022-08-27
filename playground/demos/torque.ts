import * as THREE from 'three'
import * as constants from '../constants'
import * as sword from '../../src/main'
import { randomColor } from './lib/colors'
import { mesh, radius } from './lib/spheres'

sword.setGravity(0, 0, 0)

const m4 = new THREE.Matrix4()
const matrix = new THREE.Matrix4()

m4.copy(mesh.matrixWorld).invert()

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

const ids = sword.createRigidBodies(mesh, {
  type: sword.RigidBodyType.Dynamic,
  collider: sword.ColliderType.Ball,
  radius,
  canSleep: false,
})

setTimeout(() => {
  {
    const impulses = new Float32Array(ids.length * 4)
    const scale = 0.05
    const randomTorque = () => {
      return (Math.random() * scale) - (scale / 2)
    }
  
    for (let i = 0, j = 0, l = ids.length; i < l; i += 1, j += 4) {
      impulses[j + 0] = ids[i]
      impulses[j + 1] = randomTorque()
      impulses[j + 2] = randomTorque()
      impulses[j + 3] = randomTorque()
    }
    
    sword.applyTorqueImpulses(impulses)
  }
  
}, 200)

setTimeout(() => {
  {
    const impulses = new Float32Array(ids.length * 7)
  
    const random = () => {
      return (Math.random() - 0.5) * 2
    }
  
    for (let i = 0, j = 0, l = ids.length; i < l; i += 1, j += 7) {
      impulses[j + 0] = ids[i]
      impulses[j + 1] = random()
      impulses[j + 2] = random()
      impulses[j + 3] = random()
      impulses[j + 4] = random()
      impulses[j + 5] = random()
      impulses[j + 6] = random()
    }
  
    sword.applyLinearAndTorqueImpulses(impulses)
  }  
}, 200)

