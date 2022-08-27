import * as THREE from 'three'

const bodymap: Record<number, { instance: number; mesh: THREE.Mesh }> = {}
const bodies: THREE.Mesh[] = []
const m4 = new THREE.Matrix4()
const quat = new THREE.Quaternion()

export const registerDynamicBody = (mesh: THREE.Mesh, id: number) => {
  bodies.push(mesh)
  bodymap[id] = {
    instance: -1,
    mesh,
  }
}

export const registerInstancedDynamicBody = (
  mesh: THREE.InstancedMesh,
  ids: number[]
) => {
  bodies.push(mesh)
  for (let i = 0, l = ids.length; i < l; i += 1) {
    bodymap[ids[i]] = {
      instance: i,
      mesh,
    }
  }
}

export const updateDynamicBodies = (transforms: Float32Array) => {
  for (let i = 0, l = transforms.length; i < l; i += 8) {
    if (transforms[i] === -1) {
      break
    }

    const { instance, mesh } = bodymap[transforms[i]]

    if (instance === -1) {
      mesh.position.set(
        transforms[i + 1],
        transforms[i + 2],
        transforms[i + 3]
      )
      mesh.quaternion.set(
        transforms[i + 4],
        transforms[i + 5],
        transforms[i + 6],
        transforms[i + 7]
      )
    } else if (mesh instanceof THREE.InstancedMesh) {
      quat.set(
        transforms[i + 4],
        transforms[i + 5],
        transforms[i + 6],
        transforms[i + 7]
      )
      m4.makeRotationFromQuaternion(quat)
      m4.setPosition(
        transforms[i + 1],
        transforms[i + 2],
        transforms[i + 3]
      )
      mesh.setMatrixAt(instance, m4)
      mesh.instanceMatrix.needsUpdate = true
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
