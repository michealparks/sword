import type RAPIER from '@dimforge/rapier3d-compat'

export const bodies = new Set<RAPIER.RigidBody>()
export const bodymap = new Map<number, RAPIER.RigidBody>()
export const collidermap = new Map<number, RAPIER.Collider>()
export const handleMap = new Map<number, number>()
export const reportContact = new Map<number, boolean>()
