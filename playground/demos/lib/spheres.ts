import * as THREE from 'three'
import { three } from 'trzy'
import { NUM_MESHES } from '../../constants'

const { scene } = three()

export const radius = 0.4

const material = new THREE.MeshStandardMaterial()
const geometry = new THREE.SphereGeometry(radius, 6, 6)
material.flatShading = true

export const mesh = new THREE.InstancedMesh(geometry, material, NUM_MESHES)
mesh.castShadow = true
mesh.receiveShadow = true
scene.add(mesh)
