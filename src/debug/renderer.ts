import * as THREE from 'three'
import { events } from '../constants/events'
import { scene } from 'three-kit'
import { worker } from '../lib/worker'

const material = new THREE.LineBasicMaterial({
  color: 0xffffff,
  vertexColors: true,
})

const geometry = new THREE.BufferGeometry()
const lines = new THREE.LineSegments(geometry, material)
lines.frustumCulled = false

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

/**
 * Toggles the debug drawer.
 *
 * @param debugOn The drawing state.
 * @param slowdown An optional multiplier on the framerate.
 * Default is 3 times slower than the physics frame.
 */
export const setDebugDraw = (on: boolean, slowdown = 3) => {
  if (on) {
    scene.add(lines)
  } else {
    scene.remove(lines)
  }

  worker.postMessage({
    event: events.SET_DEBUG_DRAW,
    on,
    slowdown,
  })
}
