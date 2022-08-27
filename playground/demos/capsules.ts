import * as THREE from 'three'
import { scene } from 'three-kit'
import * as sword from '../../src/main'
import { randomColor } from './lib/colors'
import { NUM_MESHES } from '../constants'

const resolution = 8
const radius = 0.25
const length = radius * 2
const geometry = new THREE.CapsuleGeometry(radius, length, resolution, resolution * 2)
const material = new THREE.MeshStandardMaterial()
const mesh = new THREE.InstancedMesh(geometry, material, NUM_MESHES)
mesh.castShadow = true
mesh.receiveShadow = true
scene.add(mesh)

const color = new THREE.Color()
const matrix = new THREE.Matrix4()

{
  const size = 10
  const half = size / 2
  for (let index = 0; index < NUM_MESHES; index += 1) {
    color.set(randomColor())
    mesh.setColorAt(index, color)
    matrix.setPosition(
      (Math.random() * size) - half,
      (Math.random() * size),
      (Math.random() * size) - half)
    mesh.setMatrixAt(index, matrix)
  }
}

mesh.instanceColor!.needsUpdate = true

sword.createRigidBodies(mesh, {
  type: sword.RigidBodyType.Dynamic,
  collider: sword.ColliderType.Capsule,
  halfHeight: length / 2,
  radius: radius,
})
