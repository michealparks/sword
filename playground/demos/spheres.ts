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

const ids = await sword.createRigidBodies(mesh, {
  type: sword.RigidBodyType.Dynamic,
  collider: sword.ColliderType.Ball,
  groups: [2],
  filter: [2],
  events: sword.ActiveEvents.CONTACT_EVENTS,
  radius,
})

for (let id of ids) {
  sword.onCollision('start', id, (...args) => {
    // console.log('collision', id, args)
  })
}

window.setInterval(async () => {
  const result = await sword.getVelocities(new Uint16Array(ids))
  // console.log(result)
}, 2000)
