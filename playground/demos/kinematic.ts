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

await sword.createRigidBodies(boxes, {
  type: sword.RigidBodyType.Dynamic,
  collider: sword.ColliderType.Cuboid,
  hx: halfExtents,
  hy: halfExtents,
  hz: halfExtents,
})

const playerId = await sword.createRigidBody(player, {
  type: sword.RigidBodyType.KinematicPositionBased,
  collider: sword.ColliderType.Cuboid,
  hx: 1,
  hy: 1,
  hz: 1,
})

sword.setActiveCollisionTypes(
  playerId,
  sword.ActiveCollisionTypes.DEFAULT | sword.ActiveCollisionTypes.KINEMATIC_FIXED
)

update(() => {
  const { position, quaternion, rotation } = player
  position.x += controls.keyboard.x / 5
  position.z -= controls.keyboard.y / 5

  rotation.y += 0.1

  sword.setNextKinematicTransform(
    playerId,
    { x: position.x, y: position.y, z: position.z },
    { x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w },
  )
})
