export interface RigidBodyOptions {
  canSleep: boolean
  ccd: boolean
  halfHeight: number
  hx: number
  hy: number
  hz: number
  id: number
  qw: number
  qx: number
  qy: number
  qz: number
  radius: number
  shape: number
  sensor: boolean
  type: number
  x: number
  y: number
  z: number
}

export interface Impulse {
  id: number
  x: number
  y: number
  z: number
}
