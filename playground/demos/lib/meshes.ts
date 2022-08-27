import * as THREE from 'three'
import { scene } from 'three-kit'
import { NUM_MESHES } from '../../constants'

const radius = 0.1
const geometry = new THREE.IcosahedronGeometry(radius)
const material = new THREE.MeshStandardMaterial()

export const mesh = new THREE.InstancedMesh(geometry, material, NUM_MESHES)
mesh.castShadow = true
mesh.receiveShadow = true
scene.add(mesh)

export const vertices = new Float32Array(geometry.attributes.position.array)
export const indexes = mesh.geometry.index ? new Float32Array(mesh.geometry.index.array) : undefined
