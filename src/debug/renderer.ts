import * as THREE from 'three'
import { scene } from 'three-kit'

const material = new THREE.LineBasicMaterial({
  color: 0xffffff,
  vertexColors: true,
})

const geometry = new THREE.BufferGeometry()
const lines = new THREE.LineSegments(geometry, material)
scene.add(lines)

interface Buffers {
  vertices: ArrayBuffer
  colors: ArrayBuffer
}

export const updateDebugDrawer = (buffers: Buffers) => {
  const vertices = new Float32Array(buffers.vertices)
  const colors = new Float32Array(buffers.colors)
  lines.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  lines.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4))
}
