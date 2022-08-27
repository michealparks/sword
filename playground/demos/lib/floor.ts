import * as THREE from 'three'
import * as sword from '../../../src/main'
import { scene } from 'three-kit'

export const floorSize = 20
export const floorHeight = 0.3

const geometry = new THREE.BoxBufferGeometry(floorSize, floorHeight, floorSize, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 0xCCCCCC })

export const floor = new THREE.Mesh(geometry, material)

floor.name = 'floor'
floor.receiveShadow = true
scene.add(floor)

sword.createRigidBody({
  ccd: true,
  mesh: floor,
  type: sword.RigidBodyType.Fixed,
  shape: sword.shapes.CUBOID,
  hx: floorSize / 2,
  hy: floorHeight / 2,
  hz: floorSize / 2,
})
