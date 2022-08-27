import * as THREE from 'three'
import { scene } from 'three-kit'
import { NUM_MESHES } from '../../constants'

export const radius = 0.1

const material = new THREE.MeshStandardMaterial()
const geometry = new THREE.SphereGeometry(radius, 6, 6)
material.flatShading = true

export const mesh = new THREE.InstancedMesh(geometry, material, NUM_MESHES)
mesh.castShadow = true
mesh.receiveShadow = true
scene.add(mesh)
