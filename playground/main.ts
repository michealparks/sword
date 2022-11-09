import './main.css'
import Inspector from 'three-inspect'
import { physicsDebugPlugin } from '../src/debug'
import { initPane } from './pane'
import * as THREE from 'three'
import { scene, run, lights, camera, update, renderer, composer } from 'three-kit'
import * as sword from '../src/main'

const debug = new Inspector(THREE, scene, camera, renderer, composer)
debug.registerPlugin(physicsDebugPlugin)

initPane(debug)

await sword.ready()

const demos = import.meta.glob('./demos/*.ts')

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
  const radius = 50
  const object = new THREE.Object3D()

  const id = await sword.createRigidBody(object, {
    collider: sword.ColliderType.Ball,
    type: sword.RigidBodyType.Sensor,
    events: sword.ActiveEvents.COLLISION_EVENTS,
    radius,
  })

  let pendingTeleports: number[] = []

  sword.onCollision('end', id, (...args) => {
    pendingTeleports.push(args[0])
  })

  update(() => {
    if (pendingTeleports.length === 0) {
      return
    }
 
    const ids = new Uint16Array(pendingTeleports)
    const translations = new Float32Array(pendingTeleports.length * 3)

    for (let i = 0, j = 0, l = ids.length; i < l; i += 1, j += 3) {
      translations[j + 0] = Math.random() * 14 - 7
      translations[j + 1] = 5
      translations[j + 2] = Math.random() * 14 - 7
    }

    sword.setTranslations(ids, translations, false, true)

    pendingTeleports.splice(0, pendingTeleports.length)
  })
}

{
  const size = 30
  const sizeY = 0.5
  const geometry = new THREE.BoxGeometry(size, sizeY, size)
  const material = new THREE.MeshStandardMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(0, -sizeY - 5, 0)
  scene.add(mesh)

  await sword.createRigidBody(mesh, {
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

run()
sword.run()
