import * as THREE from 'three'
import { scene, assets } from 'three-kit'

type GLTF = { scene: THREE.Scene }

const [ship, asteroid] = await Promise.all([
  assets.load<GLTF>('ship.glb'),
  assets.load<GLTF>('asteroid.glb'),
])

console.log(asteroid)
