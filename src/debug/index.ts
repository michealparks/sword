import * as sword from '../main'
import type Inspector from 'three-inspect'
// import { setDebugDraw } from './renderer'

const params = {
  debugDraw: false,
  dynamicBodies: 0,
  fps: 0,
}

export const physicsDebugPlugin = (inspector: Inspector) => {
  const pane = inspector.addPane('Physics')

  // const draw = localStorage.getItem('sword.debugDraw') !== null

  // if (draw) {
  //   setDebugDraw(true)
  // }

  
  // pane.addInput(params, 'debugDraw').on('change', () => {
  //   setDebugDraw(params.debugDraw)
  //   if (params.debugDraw) {
  //     localStorage.setItem('sword.debugDraw', '')
  //   } else {
  //     localStorage.removeItem('sword.debugDraw')
  //   }
  // })

  const monitors: ({ refresh(): void })[] = []

  monitors.push(pane.addMonitor(params, 'fps', {
    label: 'physics fps',
    max: 120,
    min: 0,
    view: 'graph',
  }))

  monitors.push(pane.addMonitor(params, 'dynamicBodies'))

  const update = () => {
    params.dynamicBodies = sword.dynamicCount()
    params.fps = sword.fps()

    for (let i = 0, l = monitors.length; i < l; i += 1) {
      monitors[i]!.refresh()
    }
  }

  const intervalId = window.setInterval(update, 1000)

  return () => {
    pane.dispose()
    window.clearInterval(intervalId)
  }
}
