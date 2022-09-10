import * as THREE from 'three'

const bodymap = new Map<number, { instance: number; object: THREE.Object3D }>()
const bodies: THREE.Object3D[] = []
const m4 = new THREE.Matrix4()
const quat = new THREE.Quaternion()

export const disposeAllBodies = () => {
  bodymap.clear()
  bodies.splice(0, bodies.length)
}

export const registerDynamicBody = (object: THREE.Object3D, id: number) => {
  bodies.push(object)
  bodymap.set(id, {
    instance: -1,
    object,
  })
}

export const registerInstancedDynamicBody = (
  mesh: THREE.InstancedMesh,
  ids: Uint16Array
) => {
  bodies.push(mesh)

  for (let i = 0, l = ids.length; i < l; i += 1) {
    bodymap.set(ids[i], {
      instance: i,
      object: mesh,
    })
  }
}

export const updateDynamicBodies = (ids: Uint16Array, transforms: Float32Array) => {
  for (let i = 0, j = 0, l = transforms.length; i < l; i += 7, j += 1) {
    if (transforms[i] === -1) {
      break
    }

    const { instance, object } = bodymap.get(ids[j])!

    if (instance === -1) {
      object.position.set(
        transforms[i + 0],
        transforms[i + 1],
        transforms[i + 2]
      )
      object.quaternion.set(
        transforms[i + 3],
        transforms[i + 4],
        transforms[i + 5],
        transforms[i + 6]
      )
    } else if (object instanceof THREE.InstancedMesh) {
      quat.set(
        transforms[i + 3],
        transforms[i + 4],
        transforms[i + 5],
        transforms[i + 6]
      )
      m4.makeRotationFromQuaternion(quat)
      m4.setPosition(
        transforms[i + 0],
        transforms[i + 1],
        transforms[i + 2]
      )
      object.setMatrixAt(instance, m4)
      object.instanceMatrix.needsUpdate = true
    }
  }
}

/**
 * Gets the number of dynamic bodies in the physics world.
 *
 * @returns The number of dynamic bodies.
 */
export const dynamicCount = () => {
  let num = 0

  for (let i = 0, l = bodies.length; i < l; i += 1) {
    const body = bodies[i]

    if (body instanceof THREE.InstancedMesh) {
      num += body.count
    } else {
      num += 1
    }
  }

  return num
}
