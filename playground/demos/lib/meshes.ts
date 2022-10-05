import * as THREE from 'three'
import debug from 'three-debug'
import { scene, assets } from 'three-kit'
import { NUM_MESHES } from '../../constants'
import { CustomSinCurve } from './curve'

type GLTF = { scene: THREE.Scene }

const [ship, asteroid] = await Promise.all([
  assets.load<GLTF>('ship.glb'),
  assets.load<GLTF>('asteroid.glb'),
])

const params = {
  geometry: localStorage.getItem('sword.demo.mesh.geometry') ?? 'box',
}

const meshTypes = [
  'box',
  'cone',
  'icosahedron',
  'octahedron',
  'plane',
  'tetrahedron',
  'torus',
  'torusKnot',
  'tube',
  'ship',
  'asteroid',
]

const pane = debug.addPane('Game')
pane.addInput(params, 'geometry', {
  options: Object.fromEntries(meshTypes.map(entry => ([entry, entry])))
}).on('change', () => {
  localStorage.setItem('sword.demo.mesh.geometry', params.geometry)
  window.location.reload()
})

const radius = 0.5
const path = new CustomSinCurve(1)

export let mesh: THREE.InstancedMesh
export let vertices
export let indices

let geometry: THREE.BufferGeometry

if (params.geometry === 'asteroid') {
  const template = asteroid.scene.getObjectByName('Asteroid') as THREE.Mesh
  geometry = template.geometry
  mesh = new THREE.InstancedMesh(template.geometry, template.material, NUM_MESHES)
  vertices = new Float32Array(geometry.attributes.position.array)
  indices = mesh.geometry.index ? new Uint32Array(mesh.geometry.index.array) : undefined
} else if (params.geometry === 'ship') {
  const template = ship.scene.getObjectByName('Collider') as THREE.Mesh
  geometry = template.geometry
  mesh = new THREE.InstancedMesh(template.geometry, template.material, NUM_MESHES)
  vertices = new Float32Array(geometry.attributes.position.array)
  indices = mesh.geometry.index ? new Uint32Array(mesh.geometry.index.array) : undefined
} else {
  geometry = {
    box: new THREE.BoxGeometry(radius, radius, radius),
    cone: new THREE.ConeGeometry(radius, radius * 2, 3),
    cylinder: new THREE.CylinderGeometry(radius, radius, radius * 2, 5),
    icosahedron: new THREE.IcosahedronGeometry(radius),
    octahedron: new THREE.OctahedronGeometry(radius, 1),
    plane: new THREE.PlaneGeometry(radius, radius),
    tetrahedron: new THREE.TetrahedronGeometry(radius),
    torus: new THREE.TorusGeometry(radius, radius / 3, 4, 6),
    torusKnot: new THREE.TorusKnotGeometry(radius, radius / 3, 15, 6),
    tube: new THREE.TubeGeometry(path, 15, radius / 2, 6, false)
  }[params.geometry]!
  const material = new THREE.MeshStandardMaterial()
  material.side = THREE.DoubleSide
  material.flatShading = true
  mesh = new THREE.InstancedMesh(geometry, material, NUM_MESHES)
  vertices = new Float32Array(geometry.attributes.position.array)
  indices = mesh.geometry.index ? new Uint32Array(mesh.geometry.index.array) : undefined
}

mesh.castShadow = true
mesh.receiveShadow = true
scene.add(mesh)
