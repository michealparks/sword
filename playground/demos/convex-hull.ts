import * as THREE from 'three'
import { three, loadGLTF } from 'trzy'
import * as constants from '../constants'
import * as sword from '../../src/main'
import { NUM_MESHES } from '../constants'
import { addKeyEvents } from '../lib/key-events'

const { scene } = three()

const matrix = new THREE.Matrix4()

const [ship, asteroid] = await Promise.all([
  loadGLTF('glb/ship.glb'),
  loadGLTF('glb/asteroid.glb'),
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
