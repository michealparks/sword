import * as sword from '../main'
import * as THREE from 'three'
import { camera, renderer, scene } from 'three-kit'
import debug from 'three-debug'
import { setDebugDraw } from './renderer'

debug.init(THREE, scene, camera, renderer)

// if (debug.storage.physicsDebugDraw) {
//   setDebugDraw(true)
// }

const params = {
  // debugDraw: (debug.storage.physicsDebugDraw as boolean | undefined) ?? false,
  debugDraw: false,
  dynamicBodies: 0,
  fps: 0,
}

const pane = debug.addPane('physics')
pane.addInput(params, 'debugDraw').on('change', () => {
  setDebugDraw(params.debugDraw)
  // debug.save('physicsDebugDraw', params.debugDraw)
})

const monitors: ({ refresh(): void })[] = []

const folder = debug.addFolder(debug.stats, 'physics')
monitors.push(folder.addMonitor(params, 'fps', {
  label: 'physics fps',
  max: 120,
  min: 0,
  view: 'graph',
}))

monitors.push(folder.addMonitor(params, 'dynamicBodies'))

const update = () => {
  params.dynamicBodies = sword.dynamicCount()
  params.fps = sword.fps()

  for (const monitor of monitors) {
    monitor.refresh()
  }
}

setInterval(update, 1000)
