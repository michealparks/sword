import * as constants from './constants'

const demos = import.meta.glob('./demos/*.ts')

const options = Object.fromEntries(Object.keys(demos).map(item => {
  const result = item.split('/').pop()!.replace('.ts', '')
  return [result, result]
}))

export const initPane = (debug) => {
  const parameters = {
    demo: localStorage.getItem('demo') ?? 'boxes',
    numMeshes: constants.NUM_MESHES,
  }
  const pane = debug.addPane('Demos')
  
  pane
    .addInput(parameters, 'demo', { options })
    .on('change', () => {
      window.localStorage.setItem('demo', parameters.demo)
      window.location.reload()
    })
  
  pane
    .addInput(parameters, 'numMeshes')
    .on('change', () => {
      localStorage.setItem('ammo.numCubes', String(parameters.numMeshes))
      window.location.reload()
    })  
}
