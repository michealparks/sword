import * as THREE from 'three'
import { controls, update } from 'three-kit'
import * as sword from '../../src/main'
import { boxes, halfExtents } from './lib/boxes'
import { player } from './lib/player'
import { randomColor } from './lib/colors'
import { NUM_MESHES } from '../constants'

const color = new THREE.Color()
const matrix = new THREE.Matrix4()
const floorSize = 15

for (let index = 0; index < NUM_MESHES; index += 1) {
  color.set(randomColor())
  boxes.setColorAt(index, color)
  matrix.setPosition(
    (Math.random() * floorSize) - floorSize / 2,
    2,
    (Math.random() * floorSize) - floorSize / 2
  )
  
  boxes.setMatrixAt(index, matrix)
}

boxes.instanceColor!.needsUpdate = true

sword.createRigidBodies(boxes, {
  type: sword.RigidBodyType.Dynamic,
  collider: sword.ColliderType.Cuboid,
  hx: halfExtents,
  hy: halfExtents,
  hz: halfExtents,
})

const playerId = sword.createRigidBody(player, {
  type: sword.RigidBodyType.KinematicPositionBased,
  collider: sword.ColliderType.Cuboid,
  hx: 1,
  hy: 1,
  hz: 1,
})

update(() => {
  const { position, quaternion, rotation } = player
  position.x += controls.keyboard.x / 5
  position.z -= controls.keyboard.y / 5

  rotation.y += 0.1

  sword.setNextKinematicTransforms(new Float32Array([
    playerId,
    position.x, position.y, position.z,
    quaternion.x, quaternion.y, quaternion.z, quaternion.w
  ]))
})
