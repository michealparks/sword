import * as THREE from 'three'
import * as sword from '../../../src/main'
import { three } from 'trzy'

const { scene } = three()

export const floorSize = 20
export const floorHeight = 0.3

const geometry = new THREE.BoxGeometry(floorSize, floorHeight, floorSize, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 0xCCCCCC })

export const floor = new THREE.Mesh(geometry, material)

floor.name = 'floor'
floor.receiveShadow = true
scene.add(floor)

await sword.createRigidBody(floor, {
  ccd: true,
  type: sword.RigidBodyType.Fixed,
  collider: sword.ColliderType.Cuboid,
  hx: floorSize / 2,
  hy: floorHeight / 2,
  hz: floorSize / 2,
})
