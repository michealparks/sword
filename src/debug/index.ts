
import * as debug from 'three-kit/debug'
import * as sword from '../main'
import { setDebugDraw } from './renderer'

if (debug.storage.physicsDebugDraw) {
  setDebugDraw(true)
}

const params = {
  debugDraw: debug.storage.physicsDebugDraw ?? false,
  fps: 0,
}

const pane = debug.addPane('physics')
pane.addInput(params, 'debugDraw').on('change', () => {
  setDebugDraw(params.debugDraw)
  debug.save('physicsDebugDraw', params.debugDraw)
})

const monitor = debug.stats.addMonitor(params, 'fps', {
  label: 'physics fps',
  max: 120,
  min: 0,
  view: 'graph',
})

const getFps = () => {
  params.fps = sword.fps()
  monitor.refresh()
}

setInterval(getFps, 1000)
