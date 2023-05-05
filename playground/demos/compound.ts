import * as THREE from 'three'
import { loadGLTF } from 'trzy'

type GLTF = { scene: THREE.Scene }

const [ship, asteroid] = await Promise.all([
  loadGLTF('glb/ship.glb'),
  loadGLTF('glb/asteroid.glb'),
])
