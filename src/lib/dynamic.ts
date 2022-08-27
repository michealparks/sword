import * as THREE from 'three'

const bodies = new Set<THREE.Mesh>()
const m4 = new THREE.Matrix4()
const vec3 = new THREE.Vector3()
const quat = new THREE.Quaternion()

export const registerDynamicBody = (body: THREE.Mesh) => {
  bodies.add(body)
}

export const updateDynamicBodies = (transforms: Float32Array) => {
  let tCursor = 1

  for (const body of bodies) {
    if (body instanceof THREE.InstancedMesh) {
      for (let i = 0, l = body.count; i < l; i += 1) {
        vec3.set(
          transforms[tCursor + 0],
          transforms[tCursor + 1],
          transforms[tCursor + 2]
        )
        quat.set(
          transforms[tCursor + 3],
          transforms[tCursor + 4],
          transforms[tCursor + 5],
          transforms[tCursor + 6]
        )

        m4.makeRotationFromQuaternion(quat)
        m4.setPosition(vec3)
        body.setMatrixAt(i, m4)
        tCursor += 7
      }

      body.instanceMatrix.needsUpdate = true
    } else {
      body.position.set(
        transforms[tCursor + 0],
        transforms[tCursor + 1],
        transforms[tCursor + 2]
      )
      body.quaternion.set(
        transforms[tCursor + 3],
        transforms[tCursor + 4],
        transforms[tCursor + 5],
        transforms[tCursor + 6]
      )
      tCursor += 7
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

  for (const body of bodies) {
    if (body instanceof THREE.InstancedMesh) {
      num += body.count
    } else {
      num += 1
    }
  }

  return num
}
