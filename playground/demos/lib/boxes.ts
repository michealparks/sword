import * as THREE from 'three'
import { scene } from 'three-kit'
import { NUM_MESHES } from '../../constants'

export const size = 1
const geometry = new THREE.BoxGeometry(size, size, size)
const material = new THREE.MeshStandardMaterial()

export const halfExtents = size / 2
export const boxes = new THREE.InstancedMesh(geometry, material, NUM_MESHES)

boxes.name = 'box instances'
boxes.castShadow = true
boxes.receiveShadow = true
scene.add(boxes)
