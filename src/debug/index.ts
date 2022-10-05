import * as THREE from 'three'
import * as sword from '../main'
import { camera, composer, renderer, scene } from 'three-kit'
import Debug from 'three-debug'
import { setDebugDraw } from './renderer'

export const debug = new Debug(THREE, scene, camera, renderer, composer)

// if (debug.storage.physicsDebugDraw) {
//   setDebugDraw(true)
// }

const params = {
  // debugDraw: (debug.storage.physicsDebugDraw as boolean | undefined) ?? false,
  debugDraw: false,
  dynamicBodies: 0,
  fps: 0,
}

const pane = debug.addPane('Physics')
pane.addInput(params, 'debugDraw').on('change', () => {
  setDebugDraw(params.debugDraw)
  // debug.save('physicsDebugDraw', params.debugDraw)
})

const monitors: ({ refresh(): void })[] = []

const folder = debug.stats.addFolder({ title: 'physics' })
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
