import * as THREE from 'three'
import { scene, assets } from 'three-kit'

type GLTF = { scene: THREE.Scene }

const [ship, asteroid] = await Promise.all([
  assets.loadGLTF('ship.glb'),
  assets.loadGLTF('asteroid.glb'),
])
