import * as debug from 'three-kit/debug'
import * as sword from '../main'
import { setDebugDraw } from './renderer'

if (debug.storage.physicsDebugDraw) {
  setDebugDraw(true)
}

const params = {
  debugDraw: debug.storage.physicsDebugDraw ?? false,
  dynamicBodies: 0,
  fps: 0,
}

const pane = debug.addPane('physics')
pane.addInput(params, 'debugDraw').on('change', () => {
  setDebugDraw(params.debugDraw)
  debug.save('physicsDebugDraw', params.debugDraw)
})

const monitors: unknown[] = []

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
