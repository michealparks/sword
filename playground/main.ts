import './main.css'
import './pane'
import '../src/debug'
import * as THREE from 'three'
import { scene, run, lights, camera } from 'three-kit'
import * as sword from '../src/main'
import { addKeyEvents } from './lib/key-events'

const demos = import.meta.glob('./demos/*.ts')

await sword.init()

import('./demos/lib/floor')

const fog = new THREE.Fog('lightblue')
fog.far = 1000
scene.fog = fog

camera.position.set(10, 15, 25)
camera.lookAt(0, 0, 0)

scene.background = new THREE.Color('lightblue');

const ambientLight = lights.createAmbient(undefined, 0.5)
scene.add(ambientLight)

const directionalLight = lights.createDirectional(undefined, 1.5)
scene.add(directionalLight)

directionalLight.position.set(1, 5, 1)
directionalLight.shadow.camera.left = -10
directionalLight.shadow.camera.right = 10
directionalLight.shadow.camera.top = 10
directionalLight.shadow.camera.bottom = -10
directionalLight.shadow.camera.far = 20

{
  // Create sensor
  const size = 50
  const sizeY = 5
  const geometry = new THREE.BoxGeometry(size, sizeY, size)
  const material = new THREE.MeshStandardMaterial()
  material.transparent = true
  material.opacity = 0.1
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(0, -sizeY - 1, 0)
  scene.add(mesh)
  const enter = () => {}
  const leave = () => {}
  sword.createRigidBody(mesh, {
    ccd: true,
    //sensor: true,
    collider: sword.ColliderType.Cuboid,
    type: sword.RigidBodyType.Fixed,
    hx: size / 2,
    hy: sizeY / 2,
    hz: size / 2,
  })
}

// Create demo
const savedDemo = window.localStorage.getItem('demo') || 'boxes'
await demos[`./demos/${savedDemo}.ts`]()

addKeyEvents()
run()
sword.run()
