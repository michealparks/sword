import * as THREE from 'three'
import * as constants from '../constants'
import * as sword from '../../src/main'
import { scene, assets } from 'three-kit'
import { NUM_MESHES } from '../constants'
import { addKeyEvents } from '../lib/key-events'

type GLTF = { scene: THREE.Scene }

const matrix = new THREE.Matrix4()
  
const [ship, asteroid] = await Promise.all([
  assets.load<GLTF>('ship.glb'),
  assets.load<GLTF>('asteroid.glb'),
])

const template = asteroid.scene.getObjectByName('Asteroid') as THREE.Mesh
const vertices = new Float32Array(template.geometry.attributes.position.array)

const mesh = new THREE.InstancedMesh(template.geometry, template.material, NUM_MESHES)
scene.add(mesh)

const size = 20
const half = size / 2

for (let index = 0; index < constants.NUM_MESHES; index += 1) {
  matrix.setPosition(
    (Math.random() * size) - half,
    (Math.random() * size),
    (Math.random() * size) - half
  )
  mesh.setMatrixAt(index, matrix)
}

const ids = await sword.createRigidBodies(mesh, {
  type: sword.RigidBodyType.Dynamic,
  collider: sword.ColliderType.ConvexHull,
  vertices,
  density: 5,
})

addKeyEvents(ids, 0.1)