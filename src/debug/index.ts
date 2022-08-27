import * as debug from 'three-kit/debug'
import * as sword from '../main'

const params = {
  fps: 0,
}

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
