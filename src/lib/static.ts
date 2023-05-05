import type * as THREE from 'three'

const iteration = (object: THREE.Object3D) => {
  object.matrixAutoUpdate = false
  object.updateMatrix()
}

export const setStatic = (object: THREE.Object3D) => {
  object.traverse(iteration)
}
